export function mulberry(seed: number) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rnd = mulberry(20240611)
export const r = () => rnd()
export const ri = (a: number, b: number) => Math.floor(r() * (b - a + 1)) + a
export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(r() * arr.length)]
export const wpick = <T,>(arr: readonly T[], w: number[]): T => {
  const t = w.reduce((s, x) => s + x, 0); let x = r() * t
  for (let i = 0; i < arr.length; i++) { x -= w[i]; if (x <= 0) return arr[i] }
  return arr[arr.length - 1]
}
function grp(n: number) {
  const s = Math.round(n).toString()
  if (s.length <= 3) return s
  const last = s.slice(-3); let rest = s.slice(0, -3)
  rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return rest + ',' + last
}
export const inr = (n: number) => '₹' + grp(n)
export const inrShort = (n: number) => {
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2).replace(/\.?0+$/, '') + ' Cr'
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(n % 1e5 === 0 ? 0 : 1).replace(/\.0$/, '') + ' L'
  return '₹' + grp(n)
}
export const fmtDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
export const fmtDT = (iso: string) => {
  const d = new Date(iso)
  return fmtDate(iso) + ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}
const TODAY = new Date('2026-11-22T10:00:00')
export const dateAgo = (days: number, hour = 11) => {
  const d = new Date(TODAY); d.setDate(d.getDate() - days); d.setHours(hour, ri(0, 5) * 10, 0, 0)
  return d.toISOString()
}
export const TODAY_ISO = TODAY.toISOString()
