import { UUID } from "crypto"
import { Account } from "./account.js"
import { Role } from "./role.js"

export type Account_Roles = {
    id: UUID,
    account_id: UUID,
    role_id: UUID,
    created_at: Date,
    updated_at: Date,
    account: Account,
    role: Role,
}