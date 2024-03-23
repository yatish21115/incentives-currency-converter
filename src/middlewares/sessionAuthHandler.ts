import {NextFunction, Request, Response} from "express";

export const sessionAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.user) {
        console.log('User is logged in to the application.');
        next();
    } else {
        res.status(302).json({message: {url: '/logout?expired=true'}})
    }
};