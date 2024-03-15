import {body, ValidationChain} from "express-validator";
import {validateSchema} from "../utils/schema-utils";
import {NewCurrencyRateRequest} from "../model/currencyDetails";

export const updateCurrencyRateSchema: ValidationChain[] = [
    body('rateAgainstUSD')
        .notEmpty().withMessage('rateAgainstUSD is required')
        .isNumeric().withMessage('rateAgainstUSD must be a number')
];

export const validateUpdateCurrencyRateRequest = validateSchema<NewCurrencyRateRequest>(updateCurrencyRateSchema);