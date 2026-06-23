export enum PermissionCategory {
  DASHBOARD        = 'dashboard',
  BRANCH           = 'branch',
  LOCATION         = 'location',
  ARMS_REGISTER    = 'arms_register',
  AMMUNITION       = 'ammunition',
  SECURITY_DEVICES = 'security_devices',
  USERS            = 'users',
  ROLES            = 'roles',
  PERMISSIONS      = 'permissions',
  FIREARM_HANDOVER = 'firearm_handover',
  SP_DEPLOYMENT    = 'sp_deployment',
  AMMO_REQUEST     = 'ammo_request',
  OCCURRENCE_BOOK  = 'occurrence_book',
  REPORT           = 'report',
  SETTINGS         = 'settings',
}

export interface Permission {
  id: string
  name: string
  slug: string
  category: PermissionCategory
}

export interface RoleResponse {
  id: string
  name: string
  abbreviation: string
  description: string
  is_system: boolean
  permissions: Permission[]
  created_at: string
  updated_at: string
}

export interface RoleCreate {
  name: string
  abbreviation: string
  description: string
  permission_ids: string[]
}

export type UpdateRole = Partial<RoleCreate>