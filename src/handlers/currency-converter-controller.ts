import {
    ConvertRateRequest,
    CurrencyDetails,
    NewCurrencyRateRequest,
} from "../model/currencyDetails";
import {StatusCodes} from "../utils/StatusCodes";
import {
    getCurrencyCodeToCurrenciesDetailsMap,
    processCurrencyCreationRequest,
    updateCurrencyRateRequest
} from "../services/currency-service";
import {Request} from "express";
import {ResponseModel} from "../model/response";

export const createCurrencyHandler = async (request: Request): Promise<ResponseModel> => {
    const newCurrencyDetails: CurrencyDetails = request.body;
    const currencyDetails: CurrencyDetails = await processCurrencyCreationRequest(newCurrencyDetails);
    return {
        statusCode: StatusCodes.CREATED,
        message: `Currency ${currencyDetails.displayName} created with currencyCode ${currencyDetails.currencyCode}.`
    }
}

export const updateCurrencyRateHandler = async (request: Request): Promise<ResponseModel> => {
    const currencyCode: string = request.params.currencyCode;
    const newCurrencyRateRequest: NewCurrencyRateRequest = request.body;
    const updatedCurrencyDetails: CurrencyDetails = await updateCurrencyRateRequest(currencyCode, newCurrencyRateRequest)
    return {
        statusCode: StatusCodes.OK,
        message: `Currency ${updatedCurrencyDetails.displayName} currency rate updated successfully.`
    }
}

export const convertRateRequestHandler = async (request: Request): Promise<ResponseModel> => {
    const convertRateData: ConvertRateRequest = request.body;
    const convertedQuantity: number = await getCurrencyCodeToCurrenciesDetailsMap(convertRateData);
    return {
        statusCode: StatusCodes.OK,
        message: {
            destinationCurrencyCode: convertRateData.destinationCurrencyCode,
            convertedQuantity: convertedQuantity
        }
    }
}
