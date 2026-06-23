export interface Kit {
  id: string
  name: string
  type: "maintenance" | "survival" | "cleaning" | "custom"
  quantity: number
  status: "available" | "damaged" | "lost" | "maintenance"| "decommissioned"
  createdAt: string 
  notes?: string | null
}