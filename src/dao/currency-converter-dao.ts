import {CurrencyDetails} from "../model/currencyDetails";
import {getItem, putItem} from "../utils/aws/db";
import {InternalServerError} from "../utils/errors/InternalServerError";
import dotenv from "dotenv";

dotenv.config();
const currencyDetailsTable = process.env.CurrencyDetailsTable!;

const insertToCurrency = async (currencyDetails: CurrencyDetails) => {
    return putItem(currencyDetailsTable, currencyDetails);
}

const getCurrencyForCurrencyCode = async (currencyCode: string): Promise<CurrencyDetails> => {
    const record = await getItem<CurrencyDetails>({
        TableName: currencyDetailsTable,
        Key: {
            currencyCode
        }
    });
    if(!record) {
        throw new InternalServerError("Error while getting the details of the currency provided.");
    }
    return record;
}

export const currencyConverterDao = {
    insertToCurrency,
    getCurrencyForCurrencyCode,
}