import {NextFunction, Request, Response} from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies)
    if (req.cookies && req.cookies.sessionId) {
        console.log('User is logged in to the application.');
        next();
    } else {
        res.redirect('/login')
    }
};