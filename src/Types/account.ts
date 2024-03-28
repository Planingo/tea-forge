import { UUID } from "crypto";
import { Account_Roles } from "./account_roles.js";
import { User } from "./user.js";

export type Account = {
    id: UUID,
    user_id: UUID,
    email: string,
    password: string,
    archived: boolean,
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
