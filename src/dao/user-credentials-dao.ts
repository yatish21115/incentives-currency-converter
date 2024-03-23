import dotenv from "dotenv";
import {UserDetails} from "../model/userDetails";
import {getItem, putItem} from "../utils/aws/db";

dotenv.config();
const UserDetailsTable = process.env.UserDetailsTable!;

const insert = async (userDetails: UserDetails) => {
    return putItem(UserDetailsTable, userDetails);
}

const getUserDetailsByEmail = async (emailId: string): Promise<UserDetails | undefined> => {
    return await getItem<UserDetails>({
        TableName: UserDetailsTable,
        Key: {
            emailId
        }
    });
}

export const userCredentialsDao = {
    insert,
    getUserDetailsByEmail
}