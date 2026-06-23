import { clsx, type ClassValue } from "clsx"
import { GitBranch, MapPin, Star } from "lucide-vue-next"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes with conflict resolution
 * Combines clsx for conditional classes and tailwind-merge to resolve conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.keys(value).length === 0)
  )
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2)
}


export function statusToColor(status: "available" | "lost" | 'decommissioned' | 'maintenance' | 'damaged'): string {
  const statusColorMap: Record<string, string> = {
    "available": "bg-emerald-700",
    "damaged": "bg-red-700",
    "lost": "bg-rose-900",
    "maintenance": "bg-amber-700",
    "decommissioned": "bg-gray-700",
  }
  return statusColorMap[status] || "bg-gray-500"
}

export function typeLabel(type: string) {
  if (type.toLowerCase() === 'head_office') return 'HEAD OFFICE'
  if (type.toLowerCase() === 'sub_hq')      return 'SUB-HQ'
  return 'BRANCH'
}

export function locationOfficeType(type: string) {
  if (type === 'head_office') return 'bg-purple-950/60 text-purple-300 border-purple-800/50'
  if (type === 'sub_hq')      return 'bg-cyan-950/60 text-cyan-300 border-cyan-800/50'
  return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
}

export function locationOfficeTypeIcon(type: string) {
  if (type === 'HEAD_OFFICE') return { icon: Star,      bg: 'bg-purple-950/40', color: 'text-purple-400' }
  if (type === 'SUB_HQ')      return { icon: GitBranch, bg: 'bg-cyan-950/40',   color: 'text-cyan-400' }
  return { icon: MapPin, bg: 'bg-emerald-950/40', color: 'text-emerald-500' }
}



export interface RoleStyle {
  background:  string
  color:       string
  borderColor: string
  label:       string
  [key: `--${string}`]: string
}

export const ROLES: Record<string, RoleStyle> = {
  system_admin: { label: 'System Administrator',                background: '#3b0764', color: '#c084fc', borderColor: '#7e22ce' },
  mis:          { label: 'Manager Internal Security',           background: '#7f1d1d', color: '#f87171', borderColor: '#991b1b' },
  amis:         { label: 'Assistant Manager Internal Security', background: '#7c2d12', color: '#fb923c', borderColor: '#9a3412' },
  biso:         { label: 'Branch Information Security Officer', background: '#1e3a5f', color: '#60a5fa', borderColor: '#1d4ed8' },
  mak:          { label: 'Main Armoury Keeper',                 background: '#164e63', color: '#22d3ee', borderColor: '#0e7490' },
  ak:           { label: 'Armoury Keeper',                      background: '#14532d', color: '#4ade80', borderColor: '#166534' },
  sp:           { label: 'Security Personnel',                  background: '#1e2535', color: '#94a3b8', borderColor: '#2d3748' },
  auditor:      { label: 'Auditor',                             background: '#1f2937', color: '#d1d5db', borderColor: '#374151' },
}

const _fallbackRole: RoleStyle = {
  label: 'Unknown', background: '#1e2535', color: '#94a3b8', borderColor: '#2d3748'
}

export function getRoleStyle(abbr?: string | null): RoleStyle {
  if (!abbr) return _fallbackRole
  return ROLES[abbr.toLowerCase()] ?? _fallbackRole
}

export function getRoleLabel(abbr: string): string {
  return getRoleStyle(abbr).label
}

export function getStatusClass(status: string): string {
  switch (status) {
    case 'active':    return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'disabled':  return 'bg-yellow-950/50 text-yellow-500 border border-yellow-700/50'
    case 'suspended': return 'bg-orange-950/50 text-orange-400 border border-orange-700/50'
    case 'banned':    return 'bg-red-950/50 text-red-400 border border-red-700/50'
    default:          return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

