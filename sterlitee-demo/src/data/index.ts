import { r, ri, pick, wpick, dateAgo, inrShort } from './util'

export const FIRST = ['Aarav','Rohan','Priya','Sneha','Amit','Neha','Vikram','Anjali','Rahul','Pooja','Sanjay','Kavita','Nikhil','Divya','Manish','Swati','Ajay','Meera','Siddharth','Ritu','Karan','Shweta','Prasad','Omkar','Sayali','Tejas','Madhuri','Yash','Isha','Gaurav','Deepak','Nandini','Suresh','Rashmi','Abhishek','Pallavi','Harsh','Komal','Varun','Aditi']
export const LAST = ['Sharma','Patil','Deshmukh','Kulkarni','Joshi','Mehta','Shah','Iyer','Nair','Reddy','Gupta','Agarwal','Jadhav','Pawar','More','Kale','Bhosale','Chavan','Desai','Singh','Verma','Kapoor','Malhotra','Menon','Rao','Shinde','Gokhale','Bansal','Thakur','Naik']
const name = () => pick(FIRST) + ' ' + pick(LAST)

export const SOURCES = ['99acres','MagicBricks','Housing.com','Walk-in','Channel Partner','Referral','Facebook Ads','Website'] as const
export const CONFIGS = ['1BHK','2BHK','3BHK','4BHK','Villa','Plot'] as const
export const LEAD_STATUS = ['New','Contacted','Site Visit Scheduled','Site Visit Done','Negotiation','Booked','Lost'] as const
export const PROJECTS = ['Sterlitee Regal Park','Sterlitee Heights','Sterlitee Greens','Sterlitee Business Bay'] as const
export const CITIES = ['Pune','Mumbai','Thane','Navi Mumbai']
export const LOCALITIES = ['Hinjewadi','Wakad','Baner','Kharadi','Thane','Powai','Balewadi','Hadapsar','Kalyani Nagar','Andheri East']
const PROJ_INFO: Record<string, { city: string; loc: string; rera: string }> = {
  'Sterlitee Regal Park': { city: 'Pune', loc: 'Hinjewadi', rera: 'P52100048211' },
  'Sterlitee Heights': { city: 'Mumbai', loc: 'Powai', rera: 'P51800052764' },
  'Sterlitee Greens': { city: 'Pune', loc: 'Wakad', rera: 'P52100061093' },
  'Sterlitee Business Bay': { city: 'Thane', loc: 'Thane', rera: 'P51700039455' },
}

export const EXECS = [
  { name: 'Aditya Rane', target: 6, achieved: 5, visits: 38, leads: 61 },
  { name: 'Shruti Phadke', target: 6, achieved: 7, visits: 44, leads: 70 },
  { name: 'Rajesh Naidu', target: 5, achieved: 3, visits: 29, leads: 48 },
  { name: 'Meghna Salvi', target: 5, achieved: 4, visits: 33, leads: 52 },
  { name: 'Kunal Bhatt', target: 4, achieved: 4, visits: 25, leads: 40 },
  { name: 'Farah Sheikh', target: 4, achieved: 2, visits: 21, leads: 37 },
]
const EN = EXECS.map(e => e.name)

export interface Activity { when: string; text: string }
export interface Lead { id: string; name: string; phone: string; email: string; source: string; budget: number; config: string; project: string; status: string; exec: string; city: string; created: string }
const phone = () => '+91 ' + pick(['98','99','97','88','70','91','80']) + ri(100, 999) + ' ' + ri(10000, 99999)
export const leads: Lead[] = Array.from({ length: 150 }, (_, i) => {
  const n = name(); const config = wpick(CONFIGS, [10, 30, 30, 10, 8, 12]); const project = config === 'Plot' ? 'Sterlitee Greens' : config === 'Villa' ? 'Sterlitee Greens' : wpick(PROJECTS, [45, 30, 10, 15])
  const base = { '1BHK': 55, '2BHK': 85, '3BHK': 140, '4BHK': 230, Villa: 300, Plot: 60 }[config]!
  return { id: 'L-' + (1001 + i), name: n, phone: phone(), email: n.toLowerCase().replace(' ', '.') + pick(['@gmail.com','@outlook.com','@yahoo.in','@rediffmail.com']), source: wpick(SOURCES, [20, 18, 12, 8, 15, 10, 10, 7]), budget: Math.round(base * (0.8 + r() * 0.6)) * 1e5, config, project, status: wpick(LEAD_STATUS, [20, 20, 14, 12, 10, 12, 12]), exec: pick(EN), city: PROJ_INFO[project].city, created: dateAgo(ri(0, 200)) }
})

export interface Unit { id: string; project: string; tower: string; floor: number; unitNo: string; config: string; carpet: number; sba: number; facing: string; price: number; rate: number; status: string; rera: string }
const FACING = ['East','North','West','South','North-East','North-West']
export const units: Unit[] = []
function mk(project: string, tower: string, floor: number, unit: number, config: string, carpet: number, rate: number, ids?: string) {
  const sba = Math.round(carpet * (config === 'Plot' ? 1 : 1.32)); const rt = Math.round(rate * (0.95 + r() * 0.1) + floor * 12)
  units.push({ id: ids ?? 'U-' + (units.length + 1), project, tower, floor, unitNo: String(floor * 100 + unit), config, carpet, sba, facing: pick(FACING), price: Math.round(sba * rt / 1e4) * 1e4, rate: rt, status: wpick(['Available','Blocked','Booked','Sold'], [40, 8, 22, 30]), rera: PROJ_INFO[project].rera })
}
for (const t of ['A','B','C']) for (let f = 2; f <= 13; f += 1) for (let u = 1; u <= 2; u++) if (units.length < 90) mk('Sterlitee Regal Park', 'Tower ' + t, f, u, pick(['2BHK','3BHK','3BHK','4BHK']), 0, 0)
units.forEach(u => { u.carpet = { '2BHK': 780, '3BHK': 1040, '4BHK': 1480 }[u.config] ?? 800; u.sba = Math.round(u.carpet * 1.32); u.rate = 7800 + u.floor * 25 + ri(0, 300); u.price = Math.round(u.sba * u.rate / 1e4) * 1e4 })
for (const t of ['Wing 1','Wing 2']) for (let f = 3; f <= 20; f += 3) for (let u = 1; u <= 3; u++) { if (units.filter(x => x.project === 'Sterlitee Heights').length < 48) mk('Sterlitee Heights', t, f, u, pick(['1BHK','2BHK','2BHK','3BHK']), pick([420, 640, 880]), 19500) }
for (let i = 1; i <= 36; i++) { const a = pick([1200, 1500, 2000, 2400]); mk('Sterlitee Greens', 'Phase ' + (i % 2 + 1), 0, i, 'Plot', a, 3400); const u = units[units.length - 1]; u.unitNo = 'P-' + (100 + i); u.sba = a; u.price = Math.round(a * u.rate / 1e4) * 1e4 }
for (let f = 1; f <= 8; f++) for (let u = 1; u <= 3; u++) { mk('Sterlitee Business Bay', 'Block ' + pick(['A','B']), f, u, pick(['Office','Retail','Office']) as string, pick([420, 680, 950]), 14500) }
units.forEach((u, i) => { u.id = 'U-' + (2001 + i) })

export const DEAL_STAGES = ['Enquiry','Site Visit','Negotiation','Token Paid','Agreement','Registration','Possession'] as const
export interface Deal { id: string; unit: string; unitId: string; customer: string; value: number; exec: string; stage: string; project: string; created: string }
const dealUnits = units.filter(u => u.project !== 'Sterlitee Greens' || r() < 0.5)
export const deals: Deal[] = Array.from({ length: 60 }, (_, i) => {
  const u = dealUnits[(i * 7) % dealUnits.length]
  return { id: 'D-' + (3001 + i), unit: u.project === 'Sterlitee Greens' ? `${u.tower} · ${u.unitNo} · Plot` : `${u.tower} · ${u.unitNo} · ${u.config}`, unitId: u.id, customer: name(), value: u.price, exec: pick(EN), stage: wpick(DEAL_STAGES, [14, 14, 16, 14, 12, 16, 14]), project: u.project, created: dateAgo(ri(1, 240)) }
})

export const VISIT_STATUS = ['Scheduled','Completed','No-show','Rescheduled'] as const
export interface Visit { id: string; when: string; lead: string; project: string; exec: string; status: string; feedback: string }
const FB = ['Liked the amenities, wants second visit with family','Price slightly above budget','Interested in higher floor, east facing','Comparing with competitor project in Wakad','Impressed by clubhouse and podium garden','Needs home loan pre-approval','Parking concerns raised','Wants to see sample flat again','Ready to block unit, discussing token','—']
export const visits: Visit[] = Array.from({ length: 80 }, (_, i) => {
  const st = wpick(VISIT_STATUS, [20, 50, 15, 15]); const ago = st === 'Scheduled' ? -ri(1, 14) : ri(0, 90)
  return { id: 'V-' + (4001 + i), when: dateAgo(ago, ri(10, 17)), lead: pick(leads).name, project: wpick(PROJECTS, [45, 30, 10, 15]), exec: pick(EN), status: st, feedback: st === 'Completed' ? pick(FB) : '—' }
}).sort((a, b) => b.when.localeCompare(a.when))

const FIRMS = ['Shree Ganesh','Om Sai','Lakshmi Narayan','Dwarka','Siddhivinayak','Kohinoor','Mahalaxmi','Raj Kamal','Ashtavinayak','Sunrise','Metro Square','Prime Nest','Gold Key','HomeBridge','Skyline','Vastu Vihar','Navkar','Tulsi','Jai Malhar','Orchid']
const FSUF = ['Realty','Properties','Estates','Associates','Realtors','Consultants']
export interface Partner { id: string; firm: string; contact: string; rera: string; city: string; leads: number; bookings: number; commission: number }
export const partners: Partner[] = Array.from({ length: 30 }, (_, i) => {
  const l = ri(8, 90)
  return { id: 'CP-' + (5001 + i), firm: FIRMS[i % FIRMS.length] + ' ' + pick(FSUF), contact: name(), rera: 'A' + (51700000000 + ri(10000000, 99999999)), city: pick(['Pune','Pune','Mumbai','Thane','Navi Mumbai']), leads: l, bookings: Math.max(0, Math.round(l * (0.03 + r() * 0.12))), commission: pick([1.5, 1.5, 2, 2, 2.5, 3]) }
})

export const MILESTONES = ['Booking amount','On agreement','Plinth','Slab 1','Slab 2','Slab 3','Slab 4','Possession']
export interface Payment { id: string; booking: string; customer: string; milestone: string; due: string; amount: number; paid: number; status: string; mode: string }
const pays: Payment[] = Array.from({ length: 120 }, (_, i) => {
  const d = deals[i % deals.length]; const m = pick(MILESTONES); const pct = m === 'Booking amount' ? 0.1 : m === 'On agreement' ? 0.1 : m === 'Possession' ? 0.05 : 0.08
  const amount = Math.round(d.value * pct / 1e3) * 1e3; const ago = ri(-45, 120)
  const status = ago > 0 ? wpick(['Paid','Overdue'], [88, 12]) : 'Due'
  return { id: 'PM-' + (6001 + i), booking: d.id + ' · ' + d.unit, customer: d.customer, milestone: m, due: dateAgo(ago, 10), amount, paid: status === 'Paid' ? amount : 0, status, mode: pick(['NEFT','RTGS','Cheque','UPI']) }
})
export const payments = pays

export interface Task { id: string; title: string; lead: string; due: string; exec: string; done: boolean; priority: string }
const TT = ['Call back to share price sheet','Send brochure and floor plans on WhatsApp','Confirm site visit slot','Follow up on token amount','Share loan eligibility partners','Send demand letter for next milestone','Schedule agreement signing','Collect KYC documents','Revisit negotiation on discount']
export const tasks: Task[] = Array.from({ length: 24 }, (_, i) => ({ id: 'T-' + (7001 + i), title: pick(TT), lead: pick(leads).name, due: dateAgo(ri(-7, 4), 12), exec: pick(EN), done: r() < 0.3, priority: pick(['High','Medium','Low']) }))

export const members = [
  { name: 'Sales Admin', email: 'admin@sterlitee.example', role: 'Admin' },
  { name: 'Aditya Rane', email: 'aditya@sterlitee.example', role: 'Sales Manager' },
  { name: 'Shruti Phadke', email: 'shruti@sterlitee.example', role: 'Sales Executive' },
  { name: 'Rajesh Naidu', email: 'rajesh@sterlitee.example', role: 'Sales Executive' },
  { name: 'Meghna Salvi', email: 'meghna@sterlitee.example', role: 'Accounts' },
]

export function activities(kind: string, rec: Record<string, any>): Activity[] {
  const base = rec.created ?? rec.when ?? rec.due ?? dateAgo(10)
  const d = (n: number) => { const x = new Date(base); x.setDate(x.getDate() + n); return x.toISOString() }
  const who = rec.exec ?? 'Sales Admin'
  if (kind === 'lead') return [
    { when: d(0), text: `Lead created from ${rec.source}` },
    { when: d(0), text: `Assigned to ${who}` },
    { when: d(1), text: `Call logged: interested in ${rec.config} at ${rec.project}, budget ${inrShort(rec.budget)}` },
    { when: d(3), text: `Status moved to ${rec.status}` },
  ]
  if (kind === 'deal') return [
    { when: d(0), text: `Deal created for ${rec.unit}` },
    { when: d(5), text: `${who} shared cost sheet with ${rec.customer}` },
    { when: d(12), text: `Stage moved to ${rec.stage}` },
  ]
  return [{ when: d(0), text: 'Record created' }, { when: d(1), text: `Updated by ${who}` }]
}
