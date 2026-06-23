export interface KoboListParams {
  limit?: number
  start?: number
  /** Deprecated alias of `start`, kept for completeness. */
  offset?: number
}
 
export interface KoboPaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}