import {ConvertRateRequest, CurrencyDetails, NewCurrencyRateRequest} from "../model/currencyDetails";
import {currencyConverterDao} from "../dao/currency-converter-dao";
import {InternalServerError} from "../utils/errors/InternalServerError";
import {convertRate} from "../utils/convert-rate-utils";
import {NotFoundError} from "../utils/errors/NotFoundError";
import {roundOffToThreeDecimal} from "../utils/common";

export const processCurrencyCreationRequest = async (newCurrencyDetails: CurrencyDetails, updatedBy: string): Promise<CurrencyDetails> => {
    const currencyDetails: CurrencyDetails =  {
        ...newCurrencyDetails,
        lastUpdatedAt: new Date().toISOString(),
        updatedBy
    }
    try{
        await currencyConverterDao.insert(currencyDetails);
    } catch (error) {
        throw new InternalServerError(`Error while creating currency definition for currency ${newCurrencyDetails.currencyCode}, ${JSON.stringify(error)}`);
    }
    return currencyDetails;
}

export const getAllCurrencyDetails = async (): Promise<CurrencyDetails[]> => {
    try {
        return await currencyConverterDao.getAllCurrency();
    } catch (error) {
        throw new InternalServerError(`Error while fetching all currency, ${JSON.stringify(error)}`);
    }
}

export const updateCurrencyRateRequest = async (currencyCode: string, newCurrencyRateRequest: NewCurrencyRateRequest, updatedBy: string): Promise<CurrencyDetails> => {
    const currencyDetails: CurrencyDetails = await currencyConverterDao.getCurrencyForCurrencyCode(currencyCode);
    const updatedCurrencyDetails: CurrencyDetails = {
        ...currencyDetails,
        rateAgainstUSD: newCurrencyRateRequest.rateAgainstUSD,
        updatedBy
    }
    try{
        await currencyConverterDao.insert(updatedCurrencyDetails);
    } catch (error) {
        throw new InternalServerError(`Error while updating currency definition for currency ${updatedCurrencyDetails.currencyCode}`);
    }
    return updatedCurrencyDetails;
}

export const getCurrencyCodeToCurrenciesDetailsMap = async (convertRateData: ConvertRateRequest): Promise<{currencySymbol: string, convertedQuantity: number}> => {
    const [sourceCurrencyDetail, destinationCurrencyDetail] = await Promise.all([currencyConverterDao.getCurrencyForCurrencyCode(convertRateData.sourceCurrencyCode), currencyConverterDao.getCurrencyForCurrencyCode(convertRateData.destinationCurrencyCode)]);
    if(!sourceCurrencyDetail || !destinationCurrencyDetail) {
        throw new NotFoundError("Provided source or destination currency not found");
    }
    const convertedQuantity: number = convertRate(convertRateData.conversionQuantity, sourceCurrencyDetail.rateAgainstUSD, destinationCurrencyDetail.rateAgainstUSD);
    return {
        currencySymbol: destinationCurrencyDetail.currencySymbol,
        convertedQuantity: roundOffToThreeDecimal(convertedQuantity)
    }
}