import type { BranchResponse } from "./Branch";
import type { PaginatedResponse } from "./util";


export interface LocationCreate {
  name: string;
  type: string;
  specific_area: string;
  branch_id: string;
}

export interface LocationResponse {
  id: string;
  name: string;
  type: string;
  specific_area: string;
  branch_id: string;
  branch: BranchResponse;
}

export interface LocationStats {
  in_office: number
  out_of_office: number
  total: number
}

export type UpdateLocation = Partial<LocationCreate>

export interface LocationPaginatedResponse extends PaginatedResponse<LocationResponse> {
  stats: LocationStats
}


export enum LocationType {
  IN_OFFICE  = "in_office",
  OUT_OFFICE = "out_of_office",
}