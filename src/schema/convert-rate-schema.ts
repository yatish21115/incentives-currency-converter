import {body, ValidationChain} from "express-validator";
import {
    filterEmptyFields,
    filterNonStringFields,
    generateNotValidStringMessage,
    generateParameterRequiredMessage,
    validateSchema
} from "../middlewares/schemaHandler";
import {ConvertRateRequest} from "../model/currencyDetails";

export const convertRateSchema: ValidationChain[] = [
    body(['sourceCurrencyCode', 'destinationCurrencyCode', 'conversionQuantity'])
        .notEmpty().withMessage((value, { req }) => {
        const emptyFields = filterEmptyFields(req, ['sourceCurrencyCode', 'destinationCurrencyCode', 'conversionQuantity']);
        return generateParameterRequiredMessage(emptyFields)
    }),
    body(['sourceCurrencyCode', 'destinationCurrencyCode'])
        .isString().withMessage((value, { req }) => {
        const nonStringFields = filterNonStringFields(req, ['sourceCurrencyCode', 'destinationCurrencyCode']);
        return generateNotValidStringMessage(nonStringFields)
    }),
    body('conversionQuantity')
        .isNumeric().withMessage('rateAgainstUSD must be a number')
];

export const validateConvertRateRequest = validateSchema<ConvertRateRequest>(convertRateSchema);