"use server"

import { createClient } from "@/lib/supabase/server"

export async function submitContactRequest(formData: {
  name: string
  email: string
  projectId: string
  projectTitle: string
  message: string
}) {
  const supabase = await createClient()

  try {
    // 1. Verify User Authentication Session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "Authentication required to submit inquiries." }
    }

    // Security check: Match form email with authenticated user email
    if (user.email !== formData.email) {
      return { success: false, error: "Unauthorized submission profile match." }
    }

    // 2. Insert into contact_requests table
    const { error: insertError } = await supabase
      .from("contact_requests")
      .insert({
        name: formData.name,
        email: formData.email,
        project_id: formData.projectId || null,
        project_title: formData.projectTitle || null,
        message: formData.message,
        status: "new",
        created_at: new Date().toISOString(),
      })

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    // 3. Fetch configured destination contact email
    let adminEmail = "aria.shadow@example.com"
    try {
      const { data: settings } = await supabase
        .from("homepage_settings")
        .select("contact_email")
        .eq("id", "homepage")
        .maybeSingle()

      if (settings?.contact_email) {
        adminEmail = settings.contact_email
      }
    } catch (e) {
      console.warn("Could not load homepage settings for contact notification:", e)
    }

    // 4. Send Email via Resend REST API
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Acquisitions Terminal <onboarding@resend.dev>",
            to: [adminEmail],
            subject: `[Aria Shadow Portfolio] New Inquiry: ${formData.projectTitle || "General"}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
                <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">New Portfolio Inquiry</h2>
                <p><strong>Sender:</strong> ${formData.name} (${formData.email})</p>
                <p><strong>Project:</strong> ${formData.projectTitle || "General"}</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background: #f9f9f9; border-left: 4px solid #ccc; margin: 1.5em 10px; padding: 10px 20px; font-style: italic;">
                  ${formData.message.replace(/\n/g, "<br/>")}
                </blockquote>
                <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
                <p style="font-size: 11px; color: #666;">Submitted via Aria Shadow CMS Portfolio Terminal Node.</p>
              </div>
            `,
          }),
        })

        if (!emailResponse.ok) {
          const errText = await emailResponse.text()
          console.error("Resend API returned error status:", emailResponse.status, errText)
        }
      } catch (mailErr) {
        console.error("Failed executing Resend API call:", mailErr)
      }
    } else {
      console.warn("RESEND_API_KEY environment variable is not configured. Email notification skipped.")
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" }
  }
}
