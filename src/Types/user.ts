import { UUID } from "crypto"
import { Account } from "./account.js"

export type User = {
    id: UUID,
    created_at: Date,
    updated_at: Date,
    firstname: string,
    lastname: string,
    archived: boolean,
    account: Account,
}

export type CreateUser = {
    account: {
        id: string,
        token: string
    }
}