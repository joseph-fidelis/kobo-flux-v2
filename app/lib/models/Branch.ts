import type { PaginatedResponse } from "./util";

export interface BranchCreate {
  name: string;
  location: string;
  type: string;
}


export interface BranchResponse {
  id: string;
  name: string;
  location: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export type UpdateBranch = Partial<BranchCreate>

export interface BranchStats {
  branch: number
  head_office: number
  sub_hq: number
}

export interface BranchPaginatedResponse extends PaginatedResponse<BranchResponse> {
  stats: BranchStats
}

export enum BranchType {
  HEAD_OFFICE = "head_office"
}