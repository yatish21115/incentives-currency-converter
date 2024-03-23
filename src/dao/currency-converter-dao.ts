import {CurrencyDetails} from "../model/currencyDetails";
import {getItem, putItem, scanAllItems} from "../utils/aws/db";
import {InternalServerError} from "../utils/errors/InternalServerError";
import dotenv from "dotenv";

dotenv.config();
const CurrencyDetailsTable = process.env.CurrencyDetailsTable!;

const insert = async (currencyDetails: CurrencyDetails) => {
    return putItem(CurrencyDetailsTable, currencyDetails);
}

const getCurrencyForCurrencyCode = async (currencyCode: string): Promise<CurrencyDetails> => {
    const record = await getItem<CurrencyDetails>({
        TableName: CurrencyDetailsTable,
        Key: {
            currencyCode
        }
    });
    if(!record) {
        throw new InternalServerError("Error while getting the details of the currency provided.");
    }
    return record;
}

const getAllCurrency = async (): Promise<CurrencyDetails[]> => {
    return await scanAllItems<CurrencyDetails>({
        TableName: CurrencyDetailsTable
    });
}

export const currencyConverterDao = {
    insert,
    getCurrencyForCurrencyCode,
    getAllCurrency
}