export const PERMISSIONS = {
  inventory: {
    view: 'inventory:view',
    create: 'inventory:create',
    edit: 'inventory:edit',
    delete: 'inventory:delete',
    export: 'inventory:export',
  },
  allocations: {
    view: 'allocations:view',
    create: 'allocations:create',
    approve: 'allocations:approve',
    return: 'allocations:return',
  },
  users: {
    view: 'users:view',
    create: 'users:create',
    edit: 'users:edit',
    deactivate: 'users:deactivate',
    manageRoles: 'users:manage_roles',
  },
  audit: {
    view: 'audit:view',
    export: 'audit:export',
  },
  handover: {
    create: 'handover:create',
    confirmOtp: 'handover:confirm_otp',
    return: 'handover:return',
  },
  ammoRequests: {
    create: 'ammo_requests:create',
    approve: 'ammo_requests:approve',
    fulfill: 'ammo_requests:fulfill',
  },
} as const

export enum ROLES {
  SYSTEM_ADMIN = 'system_admin',
  MIS = 'mis',
  AMIS = 'amis',
  BISO = 'biso',
  mak = 'mak',
  ak = 'ak',
  sp = 'sp',
  auditor = 'auditor',
}