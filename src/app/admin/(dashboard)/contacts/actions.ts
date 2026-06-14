"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { isCurrentUserAdmin } from "@/lib/supabase/admin"

export async function getContactRequests() {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    throw new Error("Unauthorized dashboard operations.")
  }

  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export async function updateContactStatus(id: string, status: "new" | "replied" | "closed") {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return { success: false, error: "Unauthorized operation." }
  }

  const supabase = await createClient()
  try {
    const { error } = await supabase
      .from("contact_requests")
      .update({ status })
      .eq("id", id)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteContactRequest(id: string) {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return { success: false, error: "Unauthorized operation." }
  }

  const supabase = await createClient()
  try {
    const { error } = await supabase
      .from("contact_requests")
      .delete()
      .eq("id", id)
    if (error) return { success: false, error: error.message }
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function sendAdminReply(formData: {
  inquiryId: string
  toEmail: string
  subject: string
  message: string
}) {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    return { success: false, error: "Unauthorized operation." }
  }

  if (!formData.toEmail || !formData.subject || !formData.message) {
    return { success: false, error: "Missing required fields." }
  }

  const supabase = await createClient()
  try {
    // 1. Fetch configured sender email
    let fromEmail = "aria.shadow@example.com"
    const { data: settings } = await supabase
      .from("homepage_settings")
      .select("contact_email")
      .eq("id", "homepage")
      .maybeSingle()

    if (settings?.contact_email) {
      fromEmail = settings.contact_email
    }

    // 2. Transmit email via Resend API
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Aria Shadow <onboarding@resend.dev>`,
          to: [formData.toEmail],
          reply_to: fromEmail,
          subject: formData.subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
              <p>${formData.message.replace(/\n/g, "<br/>")}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
              <p style="font-size: 11px; color: #666;">This is a reply to your inquiry from Aria Shadow Portfolio. Reply to this email to continue the conversation.</p>
            </div>
          `,
        }),
      })

      if (!emailResponse.ok) {
        const errText = await emailResponse.text()
        return { success: false, error: `Resend API Error: ${errText}` }
      }
    } else {
      console.warn("RESEND_API_KEY is not defined. Simulating reply transmission.")
    }

    // 3. Mark status as replied
    await supabase
      .from("contact_requests")
      .update({ status: "replied" })
      .eq("id", formData.inquiryId)

    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
