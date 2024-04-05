import { Account } from "./account.js"

export type User = {
    id: string,
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