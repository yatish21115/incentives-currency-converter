import {
    ConvertRateRequest,
    CurrencyDetails,
    NewCurrencyRateRequest,
} from "../model/currencyDetails";
import {StatusCodes} from "../utils/StatusCodes";
import {
    getAllCurrencyDetails,
    getCurrencyCodeToCurrenciesDetailsMap,
    processCurrencyCreationRequest,
    updateCurrencyRateRequest
} from "../services/currency-service";
import {Request} from "express";
import {ResponseModel} from "../model/response";

export const createCurrencyHandler = async (request: Request): Promise<ResponseModel> => {
    const newCurrencyDetails: CurrencyDetails = request.body;
    const updatedBy: string = request.session!.user.emailId;
    const currencyDetails: CurrencyDetails = await processCurrencyCreationRequest(newCurrencyDetails, updatedBy);
    return {
        statusCode: StatusCodes.CREATED,
        message: `Currency ${currencyDetails.displayName} created with currencyCode ${currencyDetails.currencyCode}.`
    }
}

export const getAllCurrenciesHandler = async (): Promise<ResponseModel> => {
    const allCurrencyDetails: CurrencyDetails[] = await getAllCurrencyDetails();
    return {
        statusCode: StatusCodes.OK,
        message: allCurrencyDetails.map(currency => {return {currencyCode: currency.currencyCode, displayName: currency.displayName}})
    }
}

export const updateCurrencyRateHandler = async (request: Request): Promise<ResponseModel> => {
    const currencyCode: string = request.params.currencyCode;
    const updatedBy: string = request.session!.user.emailId;
    const newCurrencyRateRequest: NewCurrencyRateRequest = request.body;
    const updatedCurrencyDetails: CurrencyDetails = await updateCurrencyRateRequest(currencyCode, newCurrencyRateRequest, updatedBy)
    return {
        statusCode: StatusCodes.OK,
        message: `Currency ${updatedCurrencyDetails.displayName} rate updated successfully.`
    }
}

export const convertRateRequestHandler = async (request: Request): Promise<ResponseModel> => {
    const convertRateData: ConvertRateRequest = request.body;
    const {currencySymbol, convertedQuantity} = await getCurrencyCodeToCurrenciesDetailsMap(convertRateData);
    return {
        statusCode: StatusCodes.OK,
        message: {
            destinationCurrencyCode: convertRateData.destinationCurrencyCode,
            destinationCurrencySymbol: currencySymbol,
            convertedQuantity: convertedQuantity
        }
    }
}
