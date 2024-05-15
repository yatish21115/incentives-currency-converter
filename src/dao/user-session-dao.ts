import dotenv from "dotenv";
import {getItem, putItem} from "../utils/aws/db";
import {UserSession} from "../model/userSession";

dotenv.config();
const UserSessionTable = process.env.UserSessionTable!;

const insert = async (userSession: UserSession) => {
    return putItem(UserSessionTable, userSession);
}

const getUserDetailsBySessionId = async (sessionId: string): Promise<UserSession | undefined> => {
    return await getItem<UserSession>({
        TableName: UserSessionTable,
        Key: {
            sessionId
        }
    });
}

export const userSessionDao = {
    insert,
    getUserDetailsBySessionId,
}