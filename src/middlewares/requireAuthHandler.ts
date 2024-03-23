import {NextFunction, Request, Response} from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.user) {
        console.log('User is logged in to the application.');
        next();
    } else {
        res.redirect('/login')
    }
};