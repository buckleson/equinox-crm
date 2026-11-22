import { DEMO_EXEC, DEMO_PARTNER } from '../data'

export type RoleId = 'admin' | 'manager' | 'executive' | 'accounts' | 'partner'
export type PageId = 'dashboard' | 'leads' | 'deals' | 'inventory' | 'visits' | 'partners' | 'payments' | 'tasks' | 'team' | 'settings' | 'admin-console' | 'my-day' | 'collections-overview' | 'partner-portal'
export type Role = { id: RoleId; label: string; person: string; email: string; description: string; home: PageId; view: PageId[]; create: PageId[] }
type Rows = Record<string, any>[]

export const PASSWORD = 'Sterlitee@123'

export const PAGE_LABELS: Record<PageId, string> = {
  dashboard: 'Dashboard', leads: 'Leads', deals: 'Deals', inventory: 'Inventory', visits: 'Site Visits', partners: 'Channel Partners', payments: 'Collections', tasks: 'Tasks', team: 'Sales Team', settings: 'Settings',
  'admin-console': 'Admin Console', 'my-day': 'My Day', 'collections-overview': 'Collections Overview', 'partner-portal': 'Partner Portal',
}

export const MODULES: PageId[] = ['dashboard', 'leads', 'deals', 'inventory', 'visits', 'partners', 'payments', 'tasks', 'team', 'settings']

const ALL_DATA_PAGES: PageId[] = ['leads', 'deals', 'inventory', 'visits', 'partners', 'payments', 'tasks']

export const ROLES: Role[] = [
  { id: 'admin', label: 'Admin', person: 'Sales Admin', email: 'admin@sterlitee.in', home: 'admin-console', description: 'Full access to every module including Settings and Sales Team. Can create records.', view: ['admin-console', 'dashboard', ...ALL_DATA_PAGES, 'team', 'settings'], create: ALL_DATA_PAGES },
  { id: 'manager', label: 'Sales Manager', person: 'Aditya Rane', email: 'aditya@sterlitee.in', home: 'dashboard', description: 'Team dashboard, pipeline, inventory, partners and Sales Team. No Settings or Collections.', view: ['dashboard', 'leads', 'deals', 'inventory', 'visits', 'partners', 'tasks', 'team'], create: ['leads', 'deals', 'inventory', 'visits', 'partners', 'tasks'] },
  { id: 'executive', label: 'Sales Executive', person: DEMO_EXEC, email: 'shruti@sterlitee.in', home: 'my-day', description: 'Own leads, deals, site visits and tasks only. Inventory is read-only. Can create leads and visits.', view: ['my-day', 'leads', 'deals', 'visits', 'tasks', 'inventory'], create: ['leads', 'visits'] },
  { id: 'accounts', label: 'Accounts', person: 'Meghna Salvi', email: 'meghna@sterlitee.in', home: 'collections-overview', description: 'CRM Finance. Collections and dashboard, with read-only access to Deals and Inventory.', view: ['collections-overview', 'dashboard', 'payments', 'deals', 'inventory'], create: [] },
  { id: 'partner', label: 'Channel Partner', person: DEMO_PARTNER.contact, email: 'partner@sterlitee.in', home: 'partner-portal', description: `${DEMO_PARTNER.firm}. Submit and track partner leads; view available inventory only.`, view: ['partner-portal', 'leads', 'inventory'], create: ['leads'] },
]

export const canView = (role: Role, page: PageId) => role.view.includes(page)
export const canCreate = (role: Role, page: PageId) => role.create.includes(page)
export const isPageId = (value: string): value is PageId => value in PAGE_LABELS
export const roleForEmail = (email: string): Role => ROLES.find(role => role.email === email.trim().toLowerCase()) ?? ROLES[0]

export function scopeRows(role: Role, page: PageId, rows: Rows): Rows {
  if (role.id === 'executive' && ['leads', 'deals', 'visits', 'tasks'].includes(page)) return rows.filter(row => row.exec === role.person)
  if (role.id === 'partner' && page === 'leads') return rows.filter(row => row.source === 'Channel Partner')
  if (role.id === 'partner' && page === 'inventory') return rows.filter(row => row.status === 'Available')
  return rows
}

const STORAGE_KEY = 'sterlitee.role'

export function readStoredRole(): RoleId | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return ROLES.some(role => role.id === value) ? (value as RoleId) : null
  } catch {
    return null
  }
}

export function storeRole(id: RoleId | null) {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}
