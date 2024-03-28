import { UUID } from "crypto"

export type Company = {
    id: UUID
    archived?: Boolean
    created_at?: Date
    updated_at: Date
    name: string
}