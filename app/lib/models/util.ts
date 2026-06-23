export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface UploadDialogProps {
  uploadFn: (file: File) => Promise<{ message: string , task_id?: string }>
  title?: string
  description?: string
  accept?: string
  hint?: string
  maxSizeMb?: number
}

export interface ApiResponse<T> {
  message: string
  data: T
}


export interface SearchResponse<T> {
  message: string
  data: T[]
}

export interface TaskResponse {
  task_id : string 
  status : string 
  result : unknown
  error : string
}

export interface HealthResponse {
  status: string;
  app: string;
  version: string;
}

export interface AppNotification {
  id: string
  type: string
  title: string
  message: string
  created_at: string
  read: boolean
}

export interface EnumResponse {
  name: string 
  value : string
}