import { UUID } from "crypto"

export type Pathway = {
    id: UUID
    archived?: Boolean
    created_at?: Date
    updated_at: Date
    name: string
}