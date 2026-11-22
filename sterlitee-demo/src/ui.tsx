import type { ReactNode } from 'react'

const CHIP: Record<string, string> = { New: 'blue', Contacted: 'purple', 'Site Visit Scheduled': 'orange', 'Site Visit Done': 'turquoise', Negotiation: 'yellow', Booked: 'green', Lost: 'red', Available: 'green', Blocked: 'yellow', Sold: 'gray', Scheduled: 'blue', Completed: 'green', 'No-show': 'red', Rescheduled: 'orange', Paid: 'green', Due: 'yellow', Overdue: 'red', Enquiry: 'blue', 'Site Visit': 'purple', 'Token Paid': 'orange', Agreement: 'turquoise', Registration: 'pink', Possession: 'green', Admin: 'purple', 'Sales Manager': 'blue', 'Sales Executive': 'turquoise', Accounts: 'orange', 'Channel Partner': 'pink' }
const PAL = ['blue', 'purple', 'orange', 'turquoise', 'pink', 'gray', 'yellow']
const chipColor = (v: string) => CHIP[v] ?? PAL[[...String(v)].reduce((s, c) => s + c.charCodeAt(0), 0) % PAL.length]
export const Chip = ({ v }: { v: string }) => <span className={'chip c-' + chipColor(v)}><i />{v}</span>

export const initials = (n: string) => n.split(' ').map(x => x[0]).slice(0, 2).join('')

export function Logo({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#1E3A5F" /><path d="M21.5 10.5c-1-1.6-3-2.5-5.2-2.5-3 0-5 1.6-5 3.9 0 2.4 2 3.2 4.9 4 2.5.7 3.4 1.2 3.4 2.2 0 1.1-1.2 1.8-2.9 1.8-1.7 0-3.1-.8-3.9-2" fill="none" stroke="#C9A227" strokeWidth="2.8" strokeLinecap="round" /></svg>
}

export function TopBar({ title, icon, children }: { title: string; icon?: ReactNode; children?: ReactNode }) {
  return <div className="top"><div className="crumb">{icon}<b>{title}</b></div><div className="top-r">{children}</div></div>
}
