import {body, ValidationChain} from "express-validator";
import {
    filterEmptyFields,
    filterNonStringFields,
    generateNotValidStringMessage,
    generateParameterRequiredMessage,
    validateSchema
} from "../middlewares/schemaHandler";
import {CurrencyDetails} from "../model/currencyDetails";

export const createCurrencySchema: ValidationChain[] = [
    body(['currencyCode', 'rateAgainstUSD', 'displayName', 'currencySymbol'])
        .notEmpty().withMessage((value, { req }) => {
            const emptyFields = filterEmptyFields(req, ['currencyCode', 'rateAgainstUSD', 'displayName', 'currencySymbol']);
            return generateParameterRequiredMessage(emptyFields)
        }),
    body(['currencyCode', 'displayName', 'currencySymbol'])
        .isString().withMessage((value, { req }) => {
            const nonStringFields = filterNonStringFields(req, ['currencyCode', 'displayName', 'currencySymbol']);
            return generateNotValidStringMessage(nonStringFields)
        }),
    body('rateAgainstUSD')
        .isFloat().withMessage('rateAgainstUSD must be a number')
];

export const validateCreateCurrencyDetailsRequest = validateSchema<CurrencyDetails>(createCurrencySchema);