import {v4} from "uuid";
import {UserSession} from "../model/userSession";
import {userSessionDao} from "../dao/user-session-dao";

export const getNewCookieSession = async (emailId: string): Promise<string> => {
    const newSessionId = v4();
    const userNewSession: UserSession = {
        sessionId: newSessionId,
        emailId,
        expiresAt: getExpiresAt(),
        lastUpdatedAt: new Date().toISOString()
    }
    await userSessionDao.insert(userNewSession);
    return newSessionId;
};

const getExpiresAt = (): number => {
    const date = new Date();
    const currentTimeInSeconds = date.setSeconds(date.getSeconds() + 10);
    return Math.floor(currentTimeInSeconds);
}