import type { PaginatedResponse } from "./util"

export interface UserCreate {
  username: string
  email: string
  first_name: string
  surname: string
  initial: string
  file_number: string
  title: string
  department: string
  directorate: string
  phone_number: string
  status : UserStatus
  password: string
  role_id: string
  branch_id: string
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  first_name: string;
  surname: string;
  initial: string;
  file_number: string;
  title: string;
  department: string;
  directorate: string;
  phone_number: string;
  status: UserStatus;
  is_superuser: boolean;
  last_login: string;
  role_id: string;
  branch_id: string;
  role: Role;
  branch: Branch;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  abbreviation: string;
  is_system: boolean;
  permissions: any[];
  created_at: string;
  updated_at: string;
}

export interface UserRoleStat {
  role_name: string
  role_abbreviation: string
  count: number
}

export interface UserStatusStats {
  active: number
  disabled: number
  suspended: number
  banned: number
  total: number
  by_role: UserRoleStat[]
}

export type UpdateUser = Partial<UserCreate>

export interface UserPaginatedResponse extends PaginatedResponse<UserResponse> {
  stats: UserStatusStats
}

export enum UserStatus {
  ALL = '',
  ACTIVE = 'active',
  DISABLED = 'disabled',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
}
