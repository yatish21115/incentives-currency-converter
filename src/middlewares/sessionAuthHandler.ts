import {NextFunction, Request, Response} from "express";
import {UserSession} from "../model/userSession";
import {userSessionDao} from "../dao/user-session-dao";

export const sessionAuth = async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.cookies.sessionId;
    const userExistingSession: UserSession | undefined = await userSessionDao.getUserDetailsBySessionId(sessionId);
    if (!sessionId || !userExistingSession || userExistingSession.expiresAt < new Date().getTime()) {
        res.status(302).json({message: {url: '/logout?expired=true'}});
        return;
    }
    if (userExistingSession && userExistingSession.sessionId === sessionId) {
        console.log('User is logged in to the application.');
        req.cookies.sessionId = userExistingSession.sessionId;
        next();
    }
};