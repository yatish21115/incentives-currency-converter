export const isObjectEmpty = (obj: object): boolean => {
    return Object.keys(obj).length === 0
}

export const roundOffToThreeDecimal = (numberToRound: number) => {
    return parseFloat(numberToRound.toFixed(3)); // Rounds to 3 decimal places
}