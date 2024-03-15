import {ConvertRateRequest, CurrencyDetails, NewCurrencyRateRequest} from "../model/currencyDetails";
import {currencyConverterDao} from "../dao/currency-converter-dao";
import {InternalServerError} from "../utils/errors/InternalServerError";
import {convertRate} from "../utils/convert-rate-utils";
import {NotFoundError} from "../utils/errors/NotFoundError";
import {roundOffToThreeDecimal} from "../utils/common";

export const processCurrencyCreationRequest = async (newCurrencyDetails: CurrencyDetails): Promise<CurrencyDetails> => {
    const currencyDetails: CurrencyDetails =  {
        ...newCurrencyDetails,
        lastUpdatedAt: new Date().toISOString()
    }
    try{
        await currencyConverterDao.insertToCurrency(currencyDetails);
    } catch (error) {
        throw new InternalServerError(`Error while creating currency definition for currency ${newCurrencyDetails.currencyCode}`);
    }
    return currencyDetails;
}

export const updateCurrencyRateRequest = async (currencyCode: string, newCurrencyRateRequest: NewCurrencyRateRequest): Promise<CurrencyDetails> => {
    const currencyDetails: CurrencyDetails = await currencyConverterDao.getCurrencyForCurrencyCode(currencyCode);
    const updatedCurrencyDetails: CurrencyDetails = {
        ...currencyDetails,
        rateAgainstUSD: newCurrencyRateRequest.rateAgainstUSD
    }
    try{
        await currencyConverterDao.insertToCurrency(updatedCurrencyDetails);
    } catch (error) {
        throw new InternalServerError(`Error while updating currency definition for currency ${updatedCurrencyDetails.currencyCode}`);
    }
    return updatedCurrencyDetails;
}

export const getCurrencyCodeToCurrenciesDetailsMap = async (convertRateData: ConvertRateRequest): Promise<number> => {
    const [sourceCurrencyDetail, destinationCurrencyDetail] = await Promise.all([currencyConverterDao.getCurrencyForCurrencyCode(convertRateData.sourceCurrencyCode), currencyConverterDao.getCurrencyForCurrencyCode(convertRateData.destinationCurrencyCode)]);
    if(!sourceCurrencyDetail || !destinationCurrencyDetail) {
        throw new NotFoundError("Provided source or destination currency not found");
    }
    const convertedQuantity: number = convertRate(convertRateData.conversionQuantity, sourceCurrencyDetail.rateAgainstUSD, destinationCurrencyDetail.rateAgainstUSD);
    return roundOffToThreeDecimal(convertedQuantity)
}