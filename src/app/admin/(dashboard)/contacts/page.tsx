import { getContactRequests } from "./actions"
import ContactsClient from "./ContactsClient"

export default async function ContactsPage() {
  const requests = await getContactRequests()

  const newCount = requests.filter((r: any) => r.status === "new").length
  const repliedCount = requests.filter((r: any) => r.status === "replied").length
  const closedCount = requests.filter((r: any) => r.status === "closed").length

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="border-b border-white/5 pb-6 sm:pb-8">
        <h1 className="text-2xl sm:text-4xl font-serif tracking-widest text-white mb-1 sm:mb-2 uppercase">Contact Inquiries</h1>
        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Manage incoming contact requests from portfolio visitors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {[
          { label: "New", value: newCount, color: "text-[var(--glow-cyan)]" },
          { label: "Replied", value: repliedCount, color: "text-emerald-400" },
          { label: "Closed", value: closedCount, color: "text-zinc-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#050814] border border-white/5 p-4 sm:p-6">
            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-2 block">{stat.label}</span>
            <p className={`text-3xl sm:text-4xl font-serif tracking-tight ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <ContactsClient requests={requests} />
    </div>
  )
}
