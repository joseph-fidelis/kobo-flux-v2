import type { Kit } from "./Kit"

export interface Request {
    id: string
    assetType: "firearm" | "ammunition" | "kit"
    assetName: string,
    quantity: number
    requestedBy: string
    requestDate: string
    // firearms : Firearm[] | null,
    // ammunitions : Ammunition[] | null,
    // kits : Kit[] | null,
    status: "pending" | "approved" | "denied" | "fulfilled" | "cancelled"
    approvedBy?: string | null
    approvedDate?: string | null
    fulfilledDate?: string | null
    notes?: string | null
}