import { useMemo, useState, useEffect } from 'react'
import { LayoutDashboard, Users, Handshake, Building2, CalendarCheck, Briefcase, Wallet, CheckSquare, UserCog, Settings as SettingsIcon, Search, Plus, X, ArrowUp, ArrowDown, Filter, ArrowUpDown, LayoutGrid, Table2, ChevronDown } from 'lucide-react'
import * as D from './data'
import { inr, inrShort, fmtDate, fmtDT } from './data/util'

type Row = Record<string, any>
type Col = { key: string; label: string; w?: number; kind?: 'chip' | 'money' | 'date' | 'datetime' | 'text' | 'num' | 'phone'; fmt?: (v: any, row: Row) => string }
type Field = { key: string; label: string; type?: 'text' | 'number' | 'select'; options?: readonly string[]; def?: any }
interface Cfg { id: string; label: string; singular: string; kind: string; cols: Col[]; statusKey?: string; statusOpts?: readonly string[]; fields: Field[]; titleKey: string; prefix: string; seed: Row[] }

const sel = (key: string, label: string, options: readonly string[]): Field => ({ key, label, type: 'select', options })
const txt = (key: string, label: string): Field => ({ key, label })
const num = (key: string, label: string): Field => ({ key, label, type: 'number' })
const EN = D.EXECS.map(e => e.name)

const CFGS: Cfg[] = [
  { id: 'leads', label: 'Leads', singular: 'Lead', kind: 'lead', prefix: 'L-', titleKey: 'name', seed: D.leads, statusKey: 'status', statusOpts: D.LEAD_STATUS,
    cols: [{ key: 'name', label: 'Name', w: 170 }, { key: 'phone', label: 'Phone', w: 140, kind: 'phone' }, { key: 'email', label: 'Email', w: 220 }, { key: 'source', label: 'Source', w: 130, kind: 'chip' }, { key: 'budget', label: 'Budget', w: 100, kind: 'money' }, { key: 'config', label: 'Config', w: 90, kind: 'chip' }, { key: 'project', label: 'Project', w: 170 }, { key: 'status', label: 'Status', w: 160, kind: 'chip' }, { key: 'exec', label: 'Assigned to', w: 130 }, { key: 'city', label: 'City', w: 100 }, { key: 'created', label: 'Created', w: 110, kind: 'date' }],
    fields: [txt('name', 'Name'), txt('phone', 'Phone'), txt('email', 'Email'), sel('source', 'Source', D.SOURCES), num('budget', 'Budget (₹)'), sel('config', 'Config', D.CONFIGS), sel('project', 'Project', D.PROJECTS), sel('status', 'Status', D.LEAD_STATUS), sel('exec', 'Assigned to', EN), txt('city', 'City')] },
  { id: 'inventory', label: 'Inventory', singular: 'Unit', kind: 'unit', prefix: 'U-', titleKey: 'unitNo', seed: D.units, statusKey: 'status', statusOpts: ['Available', 'Blocked', 'Booked', 'Sold'],
    cols: [{ key: 'project', label: 'Project', w: 170 }, { key: 'tower', label: 'Tower', w: 90 }, { key: 'floor', label: 'Floor', w: 60, kind: 'num' }, { key: 'unitNo', label: 'Unit', w: 80 }, { key: 'config', label: 'Config', w: 90, kind: 'chip' }, { key: 'carpet', label: 'Carpet (sq ft)', w: 110, kind: 'num' }, { key: 'sba', label: 'Super built-up', w: 120, kind: 'num' }, { key: 'facing', label: 'Facing', w: 100 }, { key: 'price', label: 'Price', w: 150, kind: 'money', fmt: v => inr(v) }, { key: 'rate', label: 'Rate/sq ft', w: 100, kind: 'num', fmt: v => inr(v) }, { key: 'status', label: 'Status', w: 110, kind: 'chip' }, { key: 'rera', label: 'RERA no.', w: 130 }],
    fields: [sel('project', 'Project', D.PROJECTS), txt('tower', 'Tower'), num('floor', 'Floor'), txt('unitNo', 'Unit no.'), txt('config', 'Config'), num('carpet', 'Carpet area (sq ft)'), num('sba', 'Super built-up (sq ft)'), txt('facing', 'Facing'), num('price', 'Price (₹)'), sel('status', 'Status', ['Available', 'Blocked', 'Booked', 'Sold'])] },
  { id: 'visits', label: 'Site Visits', singular: 'Site Visit', kind: 'visit', prefix: 'V-', titleKey: 'lead', seed: D.visits, statusKey: 'status', statusOpts: D.VISIT_STATUS,
    cols: [{ key: 'when', label: 'Date & time', w: 180, kind: 'datetime' }, { key: 'lead', label: 'Lead', w: 170 }, { key: 'project', label: 'Project', w: 170 }, { key: 'exec', label: 'Sales exec', w: 130 }, { key: 'status', label: 'Status', w: 120, kind: 'chip' }, { key: 'feedback', label: 'Feedback', w: 380 }],
    fields: [txt('lead', 'Lead'), sel('project', 'Project', D.PROJECTS), sel('exec', 'Sales exec', EN), sel('status', 'Status', D.VISIT_STATUS), txt('feedback', 'Feedback')] },
  { id: 'partners', label: 'Channel Partners', singular: 'Partner', kind: 'partner', prefix: 'CP-', titleKey: 'firm', seed: D.partners,
    cols: [{ key: 'firm', label: 'Firm', w: 220 }, { key: 'contact', label: 'Contact', w: 160 }, { key: 'rera', label: 'RERA agent reg. no.', w: 160 }, { key: 'city', label: 'City', w: 110 }, { key: 'leads', label: 'Leads sourced', w: 110, kind: 'num' }, { key: 'bookings', label: 'Bookings', w: 90, kind: 'num' }, { key: 'commission', label: 'Commission', w: 100, kind: 'num', fmt: v => v + '%' }],
    fields: [txt('firm', 'Firm name'), txt('contact', 'Contact'), txt('rera', 'RERA agent reg. no.'), txt('city', 'City'), num('commission', 'Commission %')] },
  { id: 'payments', label: 'Collections', singular: 'Payment', kind: 'payment', prefix: 'PM-', titleKey: 'customer', seed: D.payments, statusKey: 'status', statusOpts: ['Paid', 'Due', 'Overdue'],
    cols: [{ key: 'booking', label: 'Booking', w: 260 }, { key: 'customer', label: 'Customer', w: 160 }, { key: 'milestone', label: 'Milestone', w: 130, kind: 'chip' }, { key: 'due', label: 'Due date', w: 110, kind: 'date' }, { key: 'amount', label: 'Amount', w: 130, kind: 'money', fmt: v => inr(v) }, { key: 'paid', label: 'Paid', w: 130, kind: 'money', fmt: v => inr(v) }, { key: 'status', label: 'Status', w: 100, kind: 'chip' }, { key: 'mode', label: 'Mode', w: 80 }],
    fields: [txt('booking', 'Booking'), txt('customer', 'Customer'), sel('milestone', 'Milestone', D.MILESTONES), num('amount', 'Amount (₹)'), sel('status', 'Status', ['Paid', 'Due', 'Overdue']), sel('mode', 'Mode', ['NEFT', 'RTGS', 'Cheque', 'UPI'])] },
]
const DEALS: Cfg = { id: 'deals', label: 'Deals', singular: 'Deal', kind: 'deal', prefix: 'D-', titleKey: 'customer', seed: D.deals, statusKey: 'stage', statusOpts: D.DEAL_STAGES,
  cols: [{ key: 'id', label: 'Deal', w: 80 }, { key: 'customer', label: 'Customer', w: 170 }, { key: 'unit', label: 'Unit', w: 210 }, { key: 'project', label: 'Project', w: 170 }, { key: 'value', label: 'Value', w: 130, kind: 'money', fmt: v => inrShort(v) }, { key: 'stage', label: 'Stage', w: 130, kind: 'chip' }, { key: 'exec', label: 'Exec', w: 130 }, { key: 'created', label: 'Created', w: 110, kind: 'date' }],
  fields: [txt('customer', 'Customer'), txt('unit', 'Unit'), sel('project', 'Project', D.PROJECTS), num('value', 'Value (₹)'), sel('stage', 'Stage', D.DEAL_STAGES), sel('exec', 'Exec', EN)] }

const CHIP: Record<string, string> = { New: 'blue', Contacted: 'purple', 'Site Visit Scheduled': 'orange', 'Site Visit Done': 'turquoise', Negotiation: 'yellow', Booked: 'green', Lost: 'red', Available: 'green', Blocked: 'yellow', Sold: 'gray', Scheduled: 'blue', Completed: 'green', 'No-show': 'red', Rescheduled: 'orange', Paid: 'green', Due: 'yellow', Overdue: 'red', Enquiry: 'blue', 'Site Visit': 'purple', 'Token Paid': 'orange', Agreement: 'turquoise', Registration: 'pink', Possession: 'green' }
const PAL = ['blue', 'purple', 'orange', 'turquoise', 'pink', 'gray', 'yellow']
const chipColor = (v: string) => CHIP[v] ?? PAL[[...String(v)].reduce((s, c) => s + c.charCodeAt(0), 0) % PAL.length]
const Chip = ({ v }: { v: string }) => <span className={'chip c-' + chipColor(v)}><i />{v}</span>

function show(c: Col, row: Row) {
  const v = row[c.key]
  if (c.fmt) return c.fmt(v, row)
  if (c.kind === 'money') return inrShort(v)
  if (c.kind === 'date') return fmtDate(v)
  if (c.kind === 'datetime') return fmtDT(v)
  return String(v ?? '')
}
function cell(c: Col, row: Row) {
  if (c.kind === 'chip') return <Chip v={String(row[c.key])} />
  return <span className={c.kind === 'num' || c.kind === 'money' ? 'num' : ''}>{show(c, row)}</span>
}
const initials = (n: string) => n.split(' ').map(x => x[0]).slice(0, 2).join('')

function Logo({ size = 22 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#1E3A5F" /><path d="M21.5 10.5c-1-1.6-3-2.5-5.2-2.5-3 0-5 1.6-5 3.9 0 2.4 2 3.2 4.9 4 2.5.7 3.4 1.2 3.4 2.2 0 1.1-1.2 1.8-2.9 1.8-1.7 0-3.1-.8-3.9-2" fill="none" stroke="#C9A227" strokeWidth="2.8" strokeLinecap="round" /></svg>
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'deals', label: 'Deals', icon: Handshake },
  { id: 'inventory', label: 'Inventory', icon: Building2 },
  { id: 'visits', label: 'Site Visits', icon: CalendarCheck },
  { id: 'partners', label: 'Channel Partners', icon: Briefcase },
  { id: 'payments', label: 'Collections', icon: Wallet },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'team', label: 'Sales Team', icon: UserCog },
]

function useHash() {
  const get = () => location.hash.replace(/^#\/?/, '') || 'dashboard'
  const [h, setH] = useState(get)
  useEffect(() => { const f = () => setH(get()); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f) }, [])
  return h
}

export default function App() {
  const page = useHash()
  const [store, setStore] = useState<Record<string, Row[]>>(() => Object.fromEntries([...CFGS, DEALS].map(c => [c.id, c.seed])))
  const [tasks, setTasks] = useState<Row[]>(D.tasks)
  const cfg = [...CFGS, DEALS].find(c => c.id === page)
  const cur = NAV.find(n => n.id === page)
  return (
    <div className="app">
      <aside className="side">
        <div className="ws"><Logo /><span>Sterlitee Realty</span><ChevronDown size={14} /></div>
        <nav>
          <div className="nav-h">Workspace</div>
          {NAV.map(n => <a key={n.id} href={'#/' + n.id} className={'nav' + (page === n.id ? ' on' : '')}><n.icon size={16} />{n.label}</a>)}
          <div className="nav-h">Admin</div>
          <a href="#/settings" className={'nav' + (page === 'settings' ? ' on' : '')}><SettingsIcon size={16} />Settings</a>
        </nav>
        <div className="me"><span className="av">SA</span><div><b>Sales Admin</b><small>Sterlitee Realty</small></div></div>
      </aside>
      <main className="main">
        {page === 'dashboard' && <Dashboard store={store} />}
        {cfg && <ObjectView key={cfg.id} cfg={cfg} rows={store[cfg.id]} setRows={(f) => setStore(s => ({ ...s, [cfg.id]: f(s[cfg.id]) }))} />}
        {page === 'tasks' && <Tasks tasks={tasks} setTasks={setTasks} />}
        {page === 'team' && <Team />}
        {page === 'settings' && <Settings />}
        {!cfg && !cur && page !== 'settings' && <div className="pad">Not found</div>}
      </main>
    </div>
  )
}

function TopBar({ title, icon, children }: { title: string; icon?: React.ReactNode; children?: React.ReactNode }) {
  return <div className="top"><div className="crumb">{icon}<b>{title}</b></div><div className="top-r">{children}</div></div>
}

function ObjectView({ cfg, rows, setRows }: { cfg: Cfg; rows: Row[]; setRows: (f: (r: Row[]) => Row[]) => void }) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState<{ k: string; d: 1 | -1 } | null>(null)
  const [open, setOpen] = useState<Row | null>(null)
  const [modal, setModal] = useState(false)
  const [mode, setMode] = useState<'table' | 'board'>(cfg.id === 'deals' ? 'board' : 'table')
  const list = useMemo(() => {
    const s = q.toLowerCase()
    let out = rows.filter(r => (!status || r[cfg.statusKey!] === status) && (!s || Object.values(r).some(v => String(v).toLowerCase().includes(s))))
    if (sort) out = [...out].sort((a, b) => (a[sort.k] > b[sort.k] ? 1 : a[sort.k] < b[sort.k] ? -1 : 0) * sort.d)
    return out
  }, [rows, q, status, sort, cfg])
  const Icon = NAV.find(n => n.id === cfg.id)!.icon
  const move = (id: string, stage: string) => setRows(rs => rs.map(r => r.id === id ? { ...r, stage } : r))
  return (
    <>
      <TopBar title={cfg.label} icon={<Icon size={16} />}>
        <span className="count">{list.length}</span>
        {cfg.id === 'deals' && <div className="seg"><button className={mode === 'board' ? 'on' : ''} onClick={() => setMode('board')}><LayoutGrid size={14} />Kanban</button><button className={mode === 'table' ? 'on' : ''} onClick={() => setMode('table')}><Table2 size={14} />Table</button></div>}
        <div className="search"><Search size={14} /><input placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} /></div>
        {cfg.statusKey && <label className="sel"><Filter size={14} /><select value={status} onChange={e => setStatus(e.target.value)}><option value="">All {cfg.statusKey === "stage" ? "stages" : "statuses"}</option>{cfg.statusOpts!.map(o => <option key={o}>{o}</option>)}</select></label>}
        <label className="sel"><ArrowUpDown size={14} /><select value={sort ? sort.k + '|' + sort.d : ''} onChange={e => { const [k, d] = e.target.value.split('|'); setSort(k ? { k, d: Number(d) as 1 | -1 } : null) }}><option value="">Sort</option>{cfg.cols.flatMap(c => [<option key={c.key + 1} value={c.key + '|1'}>{c.label} ↑</option>, <option key={c.key + 2} value={c.key + '|-1'}>{c.label} ↓</option>])}</select></label>
        <button className="btn pri" onClick={() => setModal(true)}><Plus size={14} />New</button>
      </TopBar>
      {cfg.id === 'deals' && mode === 'board' ? (
        <div className="board">
          {D.DEAL_STAGES.map(st => {
            const cards = list.filter(r => r.stage === st)
            return (
              <div key={st} className="col" onDragOver={e => e.preventDefault()} onDrop={e => { move(e.dataTransfer.getData('id'), st) }}>
                <div className="col-h"><Chip v={st} /><span className="count">{cards.length}</span><span className="sum">{inrShort(cards.reduce((s, c) => s + c.value, 0))}</span></div>
                {cards.map(c => (
                  <div key={c.id} className="card" draggable onDragStart={e => e.dataTransfer.setData('id', c.id)} onClick={() => setOpen(c)}>
                    <div className="card-t">{c.unit}</div>
                    <div className="card-s">{c.customer}</div>
                    <div className="card-f"><b>{inrShort(c.value)}</b><span className="av sm" title={c.exec}>{initials(c.exec)}</span></div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th className="chk"><input type="checkbox" /></th>{cfg.cols.map(c => <th key={c.key} style={{ minWidth: c.w }} onClick={() => setSort(s => s?.k === c.key ? (s.d === 1 ? { k: c.key, d: -1 } : null) : { k: c.key, d: 1 })}>{c.label}{sort?.k === c.key && (sort.d === 1 ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}</th>)}</tr></thead>
            <tbody>{list.map(r => <tr key={r.id} onClick={() => setOpen(r)} className={open?.id === r.id ? 'sel-row' : ''}><td className="chk" onClick={e => e.stopPropagation()}><input type="checkbox" /></td>{cfg.cols.map(c => <td key={c.key}>{cell(c, r)}</td>)}</tr>)}</tbody>
          </table>
          {!list.length && <div className="empty">No records match.</div>}
        </div>
      )}
      {open && <Drawer cfg={cfg} row={rows.find(r => r.id === open.id) ?? open} onClose={() => setOpen(null)} />}
      {modal && <NewModal cfg={cfg} onClose={() => setModal(false)} onSave={row => { const n = rows.length + 1 + Math.floor(Math.random() * 0); setRows(rs => [{ ...row, id: cfg.prefix + (9000 + n) }, ...rs]); setModal(false) }} />}
    </>
  )
}

function Drawer({ cfg, row, onClose }: { cfg: Cfg; row: Row; onClose: () => void }) {
  const acts = D.activities(cfg.kind, row)
  return (
    <div className="drawer">
      <div className="dr-h"><span className="av lg">{initials(String(row[cfg.titleKey]).replace(/[^A-Za-z0-9 ]/g, '') || 'S')}</span><div><div className="dr-t">{String(row[cfg.titleKey])}</div><small>{cfg.singular} · {row.id}</small></div><button className="ico" onClick={onClose}><X size={16} /></button></div>
      <div className="dr-b">
        <div className="sec">Fields</div>
        {cfg.cols.map(c => <div className="fr" key={c.key}><label>{c.label}</label><div>{cell(c, row)}</div></div>)}
        <div className="sec">Timeline</div>
        <ul className="tl">{acts.map((a, i) => <li key={i}><i /><div>{a.text}<small>{fmtDT(a.when)}</small></div></li>)}</ul>
      </div>
    </div>
  )
}

function NewModal({ cfg, onClose, onSave }: { cfg: Cfg; onClose: () => void; onSave: (r: Row) => void }) {
  const [v, setV] = useState<Row>(() => Object.fromEntries(cfg.fields.map(f => [f.key, f.type === 'select' ? f.options![0] : f.type === 'number' ? 0 : ''])))
  const save = () => {
    const row: Row = { ...v, created: new Date().toISOString(), when: new Date().toISOString(), due: new Date().toISOString(), paid: 0, leads: 0, bookings: 0, sba: v.sba ?? 0 }
    if (cfg.id === 'inventory') { row.rate = row.sba ? Math.round(row.price / row.sba) : 0 }
    onSave(row)
  }
  return (
    <div className="ov" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()}>
        <div className="mo-h">New {cfg.singular}<button className="ico" onClick={onClose}><X size={16} /></button></div>
        <div className="mo-b">{cfg.fields.map(f => (
          <label key={f.key} className="in"><span>{f.label}</span>
            {f.type === 'select' ? <select value={v[f.key]} onChange={e => setV({ ...v, [f.key]: e.target.value })}>{f.options!.map(o => <option key={o}>{o}</option>)}</select>
              : <input type={f.type === 'number' ? 'number' : 'text'} value={v[f.key]} onChange={e => setV({ ...v, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })} />}
          </label>))}</div>
        <div className="mo-f"><button className="btn" onClick={onClose}>Cancel</button><button className="btn pri" onClick={save}>Create</button></div>
      </div>
    </div>
  )
}

function Dashboard({ store }: { store: Record<string, Row[]> }) {
  const leads = store.leads, deals = store.deals, units = store.inventory
  const booked = deals.filter(d => ['Token Paid', 'Agreement', 'Registration', 'Possession'].includes(d.stage))
  const rev = booked.reduce((s, d) => s + d.value, 0)
  const visitsMonth = store.visits.filter(v => v.when.startsWith('2026-11')).length
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], mv = [6, 8, 7, 11, 9, 13]
  const mx = Math.max(...mv)
  const stageCounts = D.DEAL_STAGES.map(s => ({ s, n: deals.filter(d => d.stage === s).length }))
  const smax = Math.max(...stageCounts.map(x => x.n))
  const top = [...store.partners].sort((a, b) => b.bookings - a.bookings).slice(0, 6)
  const kpis = [['Total Leads', leads.length, '+12% vs last month'], ['Site Visits (Nov)', visitsMonth, 'this month'], ['Bookings', booked.length, 'token paid and beyond'], ['Revenue Booked', '₹' + (rev / 1e7).toFixed(1) + ' Cr', 'across all projects'], ['Inventory Available', units.filter(u => u.status === 'Available').length, `of ${units.length} units`]]
  return (
    <>
      <TopBar title="Dashboard" icon={<LayoutDashboard size={16} />} />
      <div className="pad">
        <div className="kpis">{kpis.map(k => <div className="kpi" key={k[0]}><small>{k[0]}</small><b>{k[1]}</b><span>{k[2]}</span></div>)}</div>
        <div className="grid2">
          <div className="panel"><h3>Bookings by month</h3>
            <svg viewBox="0 0 360 170" className="chart">{mv.map((v, i) => { const h = v / mx * 120; return <g key={i}><rect x={20 + i * 56} y={140 - h} width={34} height={h} rx={4} fill={i === mv.length - 1 ? '#C9A227' : '#1E3A5F'} /><text x={37 + i * 56} y={134 - h} textAnchor="middle" fontSize="11" fill="#333">{v}</text><text x={37 + i * 56} y={158} textAnchor="middle" fontSize="11" fill="#888">{months[i]}</text></g> })}</svg></div>
          <div className="panel"><h3>Pipeline funnel</h3>{stageCounts.map(x => <div className="fun" key={x.s}><span>{x.s}</span><div><i style={{ width: x.n / smax * 100 + '%' }} /></div><b>{x.n}</b></div>)}</div>
        </div>
        <div className="panel"><h3>Top channel partners</h3>
          <table className="tbl small"><thead><tr><th>Firm</th><th>City</th><th>Leads</th><th>Bookings</th><th>Commission</th></tr></thead><tbody>{top.map(p => <tr key={p.id}><td>{p.firm}</td><td>{p.city}</td><td className="num">{p.leads}</td><td className="num">{p.bookings}</td><td className="num">{p.commission}%</td></tr>)}</tbody></table></div>
      </div>
    </>
  )
}

function Tasks({ tasks, setTasks }: { tasks: Row[]; setTasks: (t: Row[]) => void }) {
  const [q, setQ] = useState('')
  const list = tasks.filter(t => (t.title + t.lead + t.exec).toLowerCase().includes(q.toLowerCase()))
  return (<>
    <TopBar title="Tasks" icon={<CheckSquare size={16} />}><div className="search"><Search size={14} /><input placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} /></div>
      <button className="btn pri" onClick={() => { const t = prompt('Task title'); if (t) setTasks([{ id: 'T-' + Date.now(), title: t, lead: '—', due: new Date().toISOString(), exec: 'Sales Admin', done: false, priority: 'Medium' }, ...tasks]) }}><Plus size={14} />New</button></TopBar>
    <div className="pad"><div className="panel tasks">{list.map(t => <label key={t.id} className={'task' + (t.done ? ' done' : '')}><input type="checkbox" checked={t.done} onChange={() => setTasks(tasks.map(x => x.id === t.id ? { ...x, done: !x.done } : x))} /><span className="tt">{t.title}</span><span className="muted">{t.lead}</span><Chip v={t.priority} /><span className="muted">{t.exec}</span><span className="muted">{fmtDate(t.due)}</span></label>)}</div></div>
  </>)
}

function Team() {
  return (<>
    <TopBar title="Sales Team" icon={<UserCog size={16} />} />
    <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Executive</th><th>Leads</th><th>Site visits</th><th>Target (bookings)</th><th>Achieved</th><th style={{ minWidth: 200 }}>Progress</th></tr></thead>
      <tbody>{D.EXECS.map(e => { const p = Math.round(e.achieved / e.target * 100); return <tr key={e.name}><td><span className="av sm">{initials(e.name)}</span> {e.name}</td><td className="num">{e.leads}</td><td className="num">{e.visits}</td><td className="num">{e.target}</td><td className="num">{e.achieved}</td><td><div className="bar"><i style={{ width: Math.min(p, 100) + '%', background: p >= 100 ? '#2f9e5b' : '#1E3A5F' }} /></div><small>{p}%</small></td></tr> })}</tbody></table></div>
  </>)
}

function Settings() {
  return (<>
    <TopBar title="Settings" icon={<SettingsIcon size={16} />} />
    <div className="pad narrow">
      <div className="panel"><h3>Workspace</h3><label className="in"><span>Workspace name</span><input defaultValue="Sterlitee Realty" /></label><label className="in"><span>Website</span><input defaultValue="https://sterliteeregalpark.in/" /></label></div>
      <div className="panel"><h3>Members</h3>{D.members.map(m => <div className="mem" key={m.email}><span className="av">{initials(m.name)}</span><div><b>{m.name}</b><small>{m.email}</small></div><Chip v={m.role} /></div>)}</div>
      <div className="panel"><h3>Appearance</h3><div className="themes"><div className="theme on"><div className="sw light" />Light</div></div><small className="muted">Light is the only theme available in this workspace.</small></div>
    </div>
  </>)
}
