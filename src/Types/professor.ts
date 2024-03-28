import { UUID } from "crypto"
import { User } from "./user.js"

export type Professor = {
    id: UUID
    archived?: Boolean
    created_at?: Date
    updated_at: Date
    user_id: UUID
    user: User
}