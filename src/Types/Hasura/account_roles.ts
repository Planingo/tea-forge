import { Account } from "./account.js"
import { Role } from "./role.js"

export type Account_Roles = {
    id: string,
    account_id: string,
    role_id: string,
    created_at: Date,
    updated_at: Date,
    account: Account,
    role: Role,
}