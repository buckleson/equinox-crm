import { Check, X, ShieldCheck, Sun, Wallet, Briefcase, Plus, ShieldAlert } from 'lucide-react'
import * as D from '../data'
import { inr, inrShort, fmtDate, fmtDT } from '../data/util'
import { Chip, TopBar, initials } from '../ui'
import { MODULES, PAGE_LABELS, ROLES, canCreate, canView, scopeRows, type Role } from '../auth/roles'

type Row = Record<string, any>
type Store = Record<string, Row[]>
const TODAY = '2026-11-22'

const AUDIT = [
  ['Aditya Rane', 'Moved deal D-3004 to Agreement', '2026-11-22T09:42:00'],
  ['Meghna Salvi', 'Recorded NEFT receipt for PM-6012', '2026-11-22T09:15:00'],
  ['Shruti Phadke', 'Logged site visit feedback for Sterlitee Regal Park', '2026-11-21T18:20:00'],
  ['Sales Admin', 'Changed role of Kunal Bhatt to Sales Executive', '2026-11-21T16:05:00'],
  ['Rakesh Joshi', 'Submitted lead via partner portal', '2026-11-21T14:48:00'],
  ['Aditya Rane', 'Reassigned 6 leads to Rajesh Naidu', '2026-11-21T11:30:00'],
  ['Sales Admin', 'Updated workspace website', '2026-11-20T17:12:00'],
  ['Farah Sheikh', 'Created task: Collect KYC documents', '2026-11-20T12:02:00'],
]

export function AdminConsole({ store }: { store: Store }) {
  const stats = [['Users', D.members.length], ['Roles', ROLES.length], ['Leads', store.leads.length], ['Deals', store.deals.length], ['Units', store.inventory.length], ['Channel partners', store.partners.length]]
  return (<>
    <TopBar title="Admin Console" icon={<ShieldCheck size={16} />} />
    <div className="pad">
      <div className="kpis">{stats.map(s => <div className="kpi" key={s[0]}><small>{s[0]}</small><b>{s[1]}</b><span>workspace total</span></div>)}</div>
      <div className="panel"><h3>Users and roles</h3>
        <table className="tbl small"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>{D.members.map(m => <tr key={m.email}><td><span className="av sm">{initials(m.name)}</span> {m.name}</td><td>{m.email}</td><td><Chip v={m.role} /></td><td><Chip v="Completed" /></td></tr>)}</tbody></table></div>
      <div className="panel"><h3>Permission matrix</h3>
        <div className="scroll"><table className="tbl small matrix"><thead><tr><th>Role</th>{MODULES.map(m => <th key={m}>{PAGE_LABELS[m]}</th>)}</tr></thead>
          <tbody>{ROLES.map(role => <tr key={role.id}><td><Chip v={role.label} /></td>{MODULES.map(m => <td key={m} className="mx">{canView(role, m) ? <><Check size={15} className="yes" /><small>{canCreate(role, m) ? 'Edit' : 'View'}</small></> : <X size={15} className="no" />}</td>)}</tr>)}</tbody></table></div></div>
      <div className="panel"><h3>Audit log</h3>
        <ul className="tl">{AUDIT.map((a, i) => <li key={i}><i /><div><b>{a[0]}</b> {a[1]}<small>{fmtDT(a[2])}</small></div></li>)}</ul></div>
    </div>
  </>)
}

export function MyDay({ store, role }: { store: Store; role: Role }) {
  const visits = store.visits.filter(v => v.exec === role.person && v.when.startsWith(TODAY))
  const followUps = store.tasks.filter(t => t.exec === role.person && !t.done && t.due.slice(0, 10) <= TODAY)
  const leads = store.leads.filter(l => l.exec === role.person)
  const me = D.EXECS.find(e => e.name === role.person)
  const pct = me ? Math.round(me.achieved / me.target * 100) : 0
  return (<>
    <TopBar title="My Day" icon={<Sun size={16} />}><span className="muted">{fmtDate(TODAY)}</span></TopBar>
    <div className="pad">
      <div className="kpis">
        <div className="kpi"><small>Visits today</small><b>{visits.length}</b><span>scheduled</span></div>
        <div className="kpi"><small>Follow-ups due</small><b>{followUps.length}</b><span>today or overdue</span></div>
        <div className="kpi"><small>My leads</small><b>{leads.length}</b><span>assigned to you</span></div>
        <div className="kpi"><small>Target vs achieved</small><b>{me?.achieved ?? 0} / {me?.target ?? 0}</b><span>bookings this month</span></div>
      </div>
      <div className="grid2">
        <div className="panel"><h3>Today's site visits</h3>
          {visits.length ? visits.map(v => <div className="mem" key={v.id}><div><b>{v.lead}</b><small>{v.project}</small></div><span className="muted">{fmtDT(v.when)}</span><Chip v={v.status} /></div>) : <div className="muted">No visits scheduled today.</div>}</div>
        <div className="panel"><h3>Follow-ups</h3>
          {followUps.length ? followUps.map(t => <div className="mem" key={t.id}><div><b>{t.title}</b><small>{t.lead}</small></div><Chip v={t.priority} /></div>) : <div className="muted">All caught up.</div>}</div>
      </div>
      <div className="grid2">
        <div className="panel"><h3>My leads pipeline</h3>
          {D.LEAD_STATUS.map(s => <div className="fun" key={s}><span style={{ width: 150 }}><Chip v={s} /></span><div><i style={{ width: leads.length ? leads.filter(l => l.status === s).length / leads.length * 100 + '%' : 0 }} /></div><b>{leads.filter(l => l.status === s).length}</b></div>)}</div>
        <div className="panel"><h3>My target vs achieved</h3>
          <div className="big">{pct}%</div>
          <div className="bar wide"><i style={{ width: Math.min(pct, 100) + '%', background: pct >= 100 ? '#2f9e5b' : '#1E3A5F' }} /></div>
          <p className="muted">{me?.achieved} of {me?.target} bookings achieved</p></div>
      </div>
    </div>
  </>)
}

export function CollectionsOverview({ store, onOpenCollections }: { store: Store; onOpenCollections: () => void }) {
  const sum = (status: string, key: 'amount' | 'paid') => store.payments.filter(p => p.status === status).reduce((s, p) => s + p[key], 0)
  const overdue = store.payments.filter(p => p.status === 'Overdue').sort((a, b) => a.due.localeCompare(b.due))
  const cards = [['Collected', inr(sum('Paid', 'paid')), 'received to date'], ['Due', inr(sum('Due', 'amount')), `${store.payments.filter(p => p.status === 'Due').length} upcoming milestones`], ['Overdue', inr(sum('Overdue', 'amount')), `${overdue.length} milestones past due`]]
  return (<>
    <TopBar title="Collections Overview" icon={<Wallet size={16} />}><button className="btn" onClick={onOpenCollections}>All collections</button></TopBar>
    <div className="pad">
      <div className="kpis">{cards.map(c => <div className="kpi" key={c[0]}><small>{c[0]}</small><b>{c[1]}</b><span>{c[2]}</span></div>)}</div>
      <div className="panel"><h3>Overdue payments</h3>
        <table className="tbl small"><thead><tr><th>Customer</th><th>Booking</th><th>Milestone</th><th>Due date</th><th>Amount</th></tr></thead>
          <tbody>{overdue.map(p => <tr key={p.id}><td>{p.customer}</td><td>{p.booking}</td><td><Chip v={p.milestone} /></td><td>{fmtDate(p.due)}</td><td className="num">{inr(p.amount)}</td></tr>)}</tbody></table>
        {!overdue.length && <div className="empty">Nothing overdue.</div>}</div>
    </div>
  </>)
}

export function PartnerPortal({ store, role, onSubmitLead }: { store: Store; role: Role; onSubmitLead: () => void }) {
  const partner = D.DEMO_PARTNER
  const mine = store.leads.filter(l => l.partner === partner.firm)
  const commission = mine.filter(l => l.status === 'Booked').reduce((s, l) => s + l.budget * partner.commission / 100, 0)
  const available = scopeRows(role, 'inventory', store.inventory)
  const byProject = D.PROJECTS.map(p => ({ p, n: available.filter(u => u.project === p).length })).filter(x => x.n)
  const cards = [['Leads submitted', mine.length, 'via this portal'], ['Bookings', mine.filter(l => l.status === 'Booked').length, 'converted leads'], ['Commission earned', inrShort(commission), `at ${partner.commission}% of booking value`], ['Available units', available.length, 'open for sale']]
  return (<>
    <TopBar title="Partner Portal" icon={<Briefcase size={16} />}><button className="btn pri" onClick={onSubmitLead}><Plus size={14} />Submit lead</button></TopBar>
    <div className="pad">
      <div className="muted pb">{partner.firm} · RERA {partner.rera}</div>
      <div className="kpis">{cards.map(c => <div className="kpi" key={c[0]}><small>{c[0]}</small><b>{c[1]}</b><span>{c[2]}</span></div>)}</div>
      <div className="grid2">
        <div className="panel"><h3>My submitted leads</h3>
          <table className="tbl small"><thead><tr><th>Name</th><th>Project</th><th>Status</th></tr></thead>
            <tbody>{mine.map(l => <tr key={l.id}><td>{l.name}</td><td>{l.project}</td><td><Chip v={l.status} /></td></tr>)}</tbody></table></div>
        <div className="panel"><h3>Available inventory</h3>
          {byProject.map(x => <div className="mem" key={x.p}><div><b>{x.p}</b></div><span className="num">{x.n} units</span></div>)}</div>
      </div>
    </div>
  </>)
}

export function AccessDenied({ homeLabel, onHome }: { homeLabel: string; onHome: () => void }) {
  return (
    <div className="denied">
      <ShieldAlert size={40} />
      <h2>Access denied</h2>
      <p className="muted">Your role does not have permission to view this page.</p>
      <button className="btn pri" onClick={onHome}>Back to {homeLabel}</button>
    </div>
  )
}
