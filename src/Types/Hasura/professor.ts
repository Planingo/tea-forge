import { User } from "./user.js"

export type Professor = {
    id: string
    archived?: Boolean
    created_at?: Date
    updated_at: Date
    user_id: string
    user: User
}