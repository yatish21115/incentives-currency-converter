import {NextFunction, Request, Response} from "express";
import {userCredentialsDao} from "../dao/user-credentials-dao";

export const sessionAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.user) {
        const emailId = req.session.user;
        const user = await userCredentialsDao.getUserDetailsByEmail(emailId);
        if(user && user.emailId === emailId){
            console.log('User is logged in to the application.');
            next();
            return;
        }
    } else {
        res.status(302).json({message: {url: '/logout?expired=true'}})
    }
};