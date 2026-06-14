import { getContactRequests } from "./actions"
import ContactsClient from "./ContactsClient"

export default async function ContactsPage() {
  const requests = await getContactRequests()

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="border-b border-white/5 pb-6 sm:pb-8">
        <h1 className="text-2xl sm:text-4xl font-serif tracking-widest text-white mb-1 sm:mb-2 uppercase">Contact Inquiries</h1>
        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Manage incoming contact requests from portfolio visitors</p>
      </div>

      <ContactsClient requests={requests} />
    </div>
  )
}
