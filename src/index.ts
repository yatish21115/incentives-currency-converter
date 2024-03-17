import express, {Express, Response, Request, NextFunction} from "express";
import {convertRateRequestHandler, createCurrencyHandler, updateCurrencyRateHandler} from "./handlers/currency-converter-controller";
import {ConvertRateRequest, CurrencyDetails, NewCurrencyRateRequest} from "./model/currencyDetails";
import {validateCreateCurrencyDetailsRequest} from "./schema/currency-schema";
import {param} from "express-validator";
import {validateUpdateCurrencyRateRequest} from "./schema/currency-rate-change-schema";
import {ResponseModel} from "./model/response";
import {validateConvertRateRequest} from "./schema/convert-rate-schema";
import dotenv from "dotenv";
import {errorHandler} from "./middlewares/errorHandler";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.post("/currencies", validateCreateCurrencyDetailsRequest, async (req: Request<{}, {}, CurrencyDetails>, res: Response, next: NextFunction) => {
    try{
        const response: ResponseModel = await createCurrencyHandler(req);
        res.status(response.statusCode).json({message: response.message});
    } catch (error: any) {
        next(error)
    }
});

app.put("/currencies/:currencyCode/rate", [param('currencyCode').notEmpty(), validateUpdateCurrencyRateRequest], async (req: Request<{}, {}, NewCurrencyRateRequest>, res: Response, next: NextFunction) => {
    try{
        const response: ResponseModel = await updateCurrencyRateHandler(req);
        res.status(response.statusCode).json({message: response.message});
    } catch (error: any) {
        next(error)
    }
});

app.post("/currencies/conversions", validateConvertRateRequest, async (req: Request<{}, {}, ConvertRateRequest>, res: Response, next: NextFunction) => {
    try{
        const response: ResponseModel = await convertRateRequestHandler(req);
        res.status(response.statusCode).json({message: response.message});
    } catch (error: any) {
        next(error)
    }
});

app.use(errorHandler);