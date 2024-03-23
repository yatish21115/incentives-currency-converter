import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "../utils/StatusCodes";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    if (!("statusCode" in err)) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Internal Server Error', error: err.message});
    }
    res.status(<number>err.statusCode).json({message: err.message});
    next();
}