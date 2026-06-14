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
    // Insert into contact_requests table
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

    // Fetch configured destination contact email
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

    // Simulated email transmission output to logs
    console.log(`
============================================================
[EMAIL TRANSMISSION SIMULATION]
============================================================
To: ${adminEmail}
Subject: [Aria Shadow CMS] Inquiry on Project: "${formData.projectTitle}"
Sender: ${formData.name} (${formData.email})

Message Detail:
"${formData.message}"

------------------------------------------------------------
Timestamp: ${new Date().toISOString()}
============================================================
    `)

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" }
  }
}
