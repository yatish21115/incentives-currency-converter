export type CurrencyDetails = {
    currencyCode: string,
    rateAgainstUSD: number,
    displayName: string,
    currencySymbol: string,
    lastUpdatedAt: string
}

export type NewCurrencyRateRequest = {
    rateAgainstUSD: number
}

export type ConvertRateRequest = {
    sourceCurrencyCode: string,
    destinationCurrencyCode: string,
    conversionQuantity: number
}