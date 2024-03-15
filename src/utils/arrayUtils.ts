export const arrayToMap = <T, K, V>(
    array: T[] = [],
    getKey: (item: T) => K,
    getValue: (item: T) => V,
) =>
    new Map(array.map(item => [getKey(item), getValue(item)]))