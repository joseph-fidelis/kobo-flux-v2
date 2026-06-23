// lib/helpers/status-classes.ts

// ─────────────────────────────────────────
// ASSET AVAILABILITY
// ─────────────────────────────────────────
export function assetAvailabilityClass(status: string): string {
  switch (status) {
    case 'available':      return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'assigned':       return 'bg-yellow-950/50 text-yellow-500 border border-yellow-700/50'
    case 'in_maintenance': return 'bg-orange-950/50 text-orange-400 border border-orange-700/50'
    case 'disposed':       return 'bg-red-950/50 text-red-400 border border-red-700/50'
    case 'lost':           return 'bg-red-950/50 text-red-400 border border-red-700/50'
    default:               return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// ASSET CONDITION
// ─────────────────────────────────────────
export function assetConditionClass(status: string): string {
  switch (status) {
    case 'new':       return 'bg-blue-950/70 text-blue-400 border border-blue-700/50'
    case 'good':      return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'fair':      return 'bg-yellow-950/50 text-yellow-500 border border-yellow-700/50'
    case 'poor':      return 'bg-orange-950/50 text-orange-400 border border-orange-700/50'
    case 'damaged':   return 'bg-red-950/50 text-red-400 border border-red-700/50'
    case 'condemned': return 'bg-rose-950/70 text-rose-400 border border-rose-700/50'
    default:          return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// INCIDENT SEVERITY
// ─────────────────────────────────────────
export function incidentSeverityClass(status: string): string {
  switch (status) {
    case 'low':      return 'bg-blue-950/70 text-blue-400 border border-blue-700/50'
    case 'medium':   return 'bg-yellow-950/50 text-yellow-500 border border-yellow-700/50'
    case 'high':     return 'bg-orange-950/50 text-orange-400 border border-orange-700/50'
    case 'critical': return 'bg-red-950/70 text-red-400 border border-red-700/50'
    default:         return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// INCIDENT STATUS
// ─────────────────────────────────────────
export function incidentStatusClass(status: string): string {
  switch (status) {
    case 'submitted':     return 'bg-blue-950/70 text-blue-400 border border-blue-700/50'
    case 'under_review':  return 'bg-yellow-950/50 text-yellow-500 border border-yellow-700/50'
    case 'escalated':     return 'bg-orange-950/50 text-orange-400 border border-orange-700/50'
    case 'resolved':      return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'dismissed':     return 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
    default:              return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// APPROVAL STATUS
// ─────────────────────────────────────────
export function approvalStatusClass(status: string): string {
  switch (status) {
    case 'pending':  return 'bg-yellow-950/50 text-yellow-500 border border-yellow-700/50'
    case 'approved': return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'rejected': return 'bg-red-950/50 text-red-400 border border-red-700/50'
    default:         return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// ASSET TYPE
// ─────────────────────────────────────────
export function assetTypeClass(status: string): string {
  switch (status) {
    case 'firearm':          return 'bg-blue-950/70 text-blue-400 border border-blue-700/50'
    case 'security_device':  return 'bg-purple-950/70 text-purple-400 border border-purple-700/50'
    default:                 return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// BRANCH TYPE
// ─────────────────────────────────────────
export function branchTypeClass(status: string): string {
  switch (status) {
    case 'head_office': return 'bg-blue-950/70 text-blue-400 border border-blue-700/50'
    case 'sub_hq':      return 'bg-indigo-950/70 text-indigo-400 border border-indigo-700/50'
    case 'branch':      return 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
    default:            return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// LOCATION TYPE
// ─────────────────────────────────────────
export function locationTypeClass(status: string): string {
  switch (status) {
    case 'in_office':     return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'out_of_office': return 'bg-purple-950/70 text-purple-400 border border-purple-700/50'
    default:              return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// MAINTENANCE STATUS
// ─────────────────────────────────────────
export function maintenanceStatusClass(status: string): string {
  switch (status) {
    case 'scheduled':    return 'bg-blue-950/70 text-blue-400 border border-blue-700/50'
    case 'in_progress':  return 'bg-yellow-950/50 text-yellow-500 border border-yellow-700/50'
    case 'completed':    return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'cancelled':    return 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
    case 'overdue':      return 'bg-red-950/50 text-red-400 border border-red-700/50'
    default:             return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// MAINTENANCE TYPE
// ─────────────────────────────────────────
export function maintenanceTypeClass(status: string): string {
  switch (status) {
    case 'routine':        return 'bg-blue-950/70 text-blue-400 border border-blue-700/50'
    case 'corrective':     return 'bg-orange-950/50 text-orange-400 border border-orange-700/50'
    case 'preventive':     return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'emergency':      return 'bg-red-950/50 text-red-400 border border-red-700/50'
    case 'cleaning':       return 'bg-cyan-950/70 text-cyan-400 border border-cyan-700/50'
    case 'parts_replace':  return 'bg-purple-950/70 text-purple-400 border border-purple-700/50'
    default:               return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// INSPECTION RESULT
// ─────────────────────────────────────────
export function inspectionResultClass(status: string): string {
  switch (status) {
    case 'passed':       return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'failed':       return 'bg-red-950/50 text-red-400 border border-red-700/50'
    case 'needs_repair': return 'bg-orange-950/50 text-orange-400 border border-orange-700/50'
    case 'condemned':    return 'bg-rose-950/70 text-rose-400 border border-rose-700/50'
    default:             return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// INSPECTION TYPE
// ─────────────────────────────────────────
export function inspectionTypeClass(status: string): string {
  switch (status) {
    case 'routine':         return 'bg-blue-950/70 text-blue-400 border border-blue-700/50'
    case 'pre_deployment':  return 'bg-yellow-950/50 text-yellow-500 border border-yellow-700/50'
    case 'post_deployment': return 'bg-purple-950/70 text-purple-400 border border-purple-700/50'
    case 'random':          return 'bg-cyan-950/70 text-cyan-400 border border-cyan-700/50'
    case 'annual':          return 'bg-indigo-950/70 text-indigo-400 border border-indigo-700/50'
    default:                return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// AMMUNITION STATUS
// ─────────────────────────────────────────
export function ammunitionStatusClass(status: string): string {
  switch (status) {
    case 'available':  return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'low_stock':  return 'bg-yellow-950/50 text-yellow-500 border border-yellow-700/50'
    case 'depleted':   return 'bg-red-950/50 text-red-400 border border-red-700/50'
    case 'expired':    return 'bg-orange-950/50 text-orange-400 border border-orange-700/50'
    case 'condemned':  return 'bg-rose-950/70 text-rose-400 border border-rose-700/50'
    default:           return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// AMMUNITION UNIT
// ─────────────────────────────────────────
export function ammunitionUnitClass(status: string): string {
  switch (status) {
    case 'rounds':    return 'bg-blue-950/70 text-blue-400 border border-blue-700/50'
    case 'boxes':     return 'bg-indigo-950/70 text-indigo-400 border border-indigo-700/50'
    case 'magazines': return 'bg-purple-950/70 text-purple-400 border border-purple-700/50'
    case 'belts':     return 'bg-cyan-950/70 text-cyan-400 border border-cyan-700/50'
    case 'canisters': return 'bg-orange-950/50 text-orange-400 border border-orange-700/50'
    default:          return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// USER STATUS
// ─────────────────────────────────────────
export function userStatusClass(status: string): string {
  switch (status) {
    case 'active':    return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'disabled':  return 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
    case 'suspended': return 'bg-orange-950/50 text-orange-400 border border-orange-700/50'
    case 'banned':    return 'bg-red-950/50 text-red-400 border border-red-700/50'
    default:          return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// ROSTER STATUS
// ─────────────────────────────────────────
export function rosterStatusClass(status: string): string {
  switch (status) {
    case 'draft':     return 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
    case 'active':    return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'completed': return 'bg-blue-950/70 text-blue-400 border border-blue-700/50'
    case 'cancelled': return 'bg-red-950/50 text-red-400 border border-red-700/50'
    default:          return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// DEPLOYMENT STATUS
// ─────────────────────────────────────────
export function deploymentStatusClass(status: string): string {
  switch (status) {
    case 'assigned': return 'bg-blue-950/70 text-blue-400 border border-blue-700/50'
    case 'deployed': return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'returned': return 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
    case 'absent':   return 'bg-red-950/50 text-red-400 border border-red-700/50'
    default:         return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// HANDOVER STATUS
// ─────────────────────────────────────────
export function handoverStatusClass(status: string): string {
  switch (status) {
    case 'pending':   return 'bg-yellow-950/50 text-yellow-500 border border-yellow-700/50'
    case 'partial':   return 'bg-orange-950/50 text-orange-400 border border-orange-700/50'
    case 'completed': return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    default:          return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}

// ─────────────────────────────────────────
// FIREARM RETURN CONDITION
// ─────────────────────────────────────────
export function firearmReturnConditionClass(status: string): string {
  switch (status) {
    case 'excellent': return 'bg-emerald-950/70 text-emerald-400 border border-emerald-700/50'
    case 'good':      return 'bg-blue-950/70 text-blue-400 border border-blue-700/50'
    case 'fair':      return 'bg-yellow-950/50 text-yellow-500 border border-yellow-700/50'
    case 'damaged':   return 'bg-red-950/50 text-red-400 border border-red-700/50'
    case 'lost':      return 'bg-rose-950/70 text-rose-400 border border-rose-700/50'
    default:          return 'bg-[#1e2535] text-slate-500 border border-slate-700/60'
  }
}