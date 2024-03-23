import express, {NextFunction, Request, Response, Router} from "express";
import {validateCreateCurrencyDetailsRequest} from "../schema/currency-schema";
import {ConvertRateRequest, CurrencyDetails, NewCurrencyRateRequest} from "../model/currencyDetails";
import {ResponseModel} from "../model/response";
import {
    convertRateRequestHandler,
    createCurrencyHandler,
    getAllCurrenciesHandler,
    updateCurrencyRateHandler
} from "../handlers/currency-converter-controller";
import {param} from "express-validator";
import {validateUpdateCurrencyRateRequest} from "../schema/currency-rate-change-schema";
import {validateConvertRateRequest} from "../schema/convert-rate-schema";

const router: Router = express.Router();

router.post("/", validateCreateCurrencyDetailsRequest, async (req: Request<{}, {}, CurrencyDetails>, res: Response, next: NextFunction) => {
    try{
        const response: ResponseModel = await createCurrencyHandler(req);
        res.status(response.statusCode).json({message: response.message});
    } catch (error: any) {
        next(error)
    }
});

router.get("/getAll", async (req: Request, res: Response, next: NextFunction) => {
    try{
        const response: ResponseModel = await getAllCurrenciesHandler();
        res.status(response.statusCode).json({message: response.message});
    } catch (error: any) {
        next(error)
    }
})

router.put("/:currencyCode/rate", [param('currencyCode').notEmpty(), validateUpdateCurrencyRateRequest], async (req: Request<{}, {}, NewCurrencyRateRequest>, res: Response, next: NextFunction) => {
    try{
        const response: ResponseModel = await updateCurrencyRateHandler(req);
        res.status(response.statusCode).json({message: response.message});
    } catch (error: any) {
        next(error)
    }
});

router.post("/conversions", validateConvertRateRequest, async (req: Request<{}, {}, ConvertRateRequest>, res: Response, next: NextFunction) => {
    try{
        const response: ResponseModel = await convertRateRequestHandler(req);
        res.status(response.statusCode).json({message: response.message});
    } catch (error: any) {
        next(error)
    }
});

export default router;