import { Account_Roles } from "./account_roles.js";
import { User } from "./user.js";

export type Account = {
    id: string,
    user_id: string,
    email: string,
    password: string,
    archived: boolean,
    created_at: Date,
    updated_at: Date,
    account_roles: Account_Roles[],
    user: User,
}

export type CreateAccount = {
    insert_account: {
        affected_rows: number;
        returning: [{
            id: string;
        }];
    };
} | {}
