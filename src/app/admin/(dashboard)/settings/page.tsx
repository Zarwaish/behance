import { getSettings } from "./actions"
import SettingsForm from "./SettingsForm"

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="border-b border-white/5 pb-6 sm:pb-8">
        <h1 className="text-2xl sm:text-4xl font-serif tracking-widest text-white mb-1 sm:mb-2 uppercase">System Settings</h1>
        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Configure platform-wide settings for the CMS</p>
      </div>

      <SettingsForm initialEmail={settings.contact_email} />
    </div>
  )
}
