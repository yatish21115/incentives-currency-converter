import express, {NextFunction, Request, Response} from "express";
import path from "node:path";
import {LoginDetails} from "../model/userDetails";
import {ResponseModel} from "../model/response";
import {loginHandler} from "../handlers/login-controller";

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'templates', 'login.html'))
});

router.post('/', async (req: Request<{}, {}, LoginDetails>, res: Response, next: NextFunction) => {
    try {
        const response: ResponseModel = await loginHandler(req, res);
        res.status(response.statusCode).json({message: response.message});
    } catch (error: any) {
        next(error)
    }
});

export default router;