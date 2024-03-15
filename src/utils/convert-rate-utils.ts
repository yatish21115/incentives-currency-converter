export const convertRate = (conversionQuantity: number, rateAgainstUSDForSourceCurrency: number, rateAgainstUSDForDestinationCurrency: number): number => {
    const valueInUSD = conversionQuantity / rateAgainstUSDForDestinationCurrency;
    return valueInUSD * rateAgainstUSDForSourceCurrency;
}