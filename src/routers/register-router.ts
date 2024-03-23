import express, {NextFunction, Request, Response, Router} from "express";
import {UserDetails} from "../model/userDetails";
import {ResponseModel} from "../model/response";
import {createUserDetailsHandler, updateUserDetailsHandler} from "../handlers/user-details-controller";
import path from "node:path";

const router: Router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'templates', 'register.html'))
})

router.post('/',  async (req: Request<{}, {}, UserDetails>, res: Response, next: NextFunction)=> {
    try{
        const response: ResponseModel = await createUserDetailsHandler(req);
        res.status(response.statusCode).json({message: response.message});
    } catch (error: any) {
        next(error)
    }
});

router.put('/updateUser', async (req: Request<{}, {}, UserDetails>, res: Response, next: NextFunction) => {
    try {
        const response: ResponseModel = await updateUserDetailsHandler(req);
        res.status(response.statusCode).json({message: response.message});
    } catch (error: any) {
        next(error)
    }
});

export default router;