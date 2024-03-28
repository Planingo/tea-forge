import { UUID } from "crypto"

export type Room = {
    id: UUID
    archived?: Boolean
    created_at?: Date
    updated_at: Date
    name: string
    max_seats: number
}