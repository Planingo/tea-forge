export function uniqBy<T>(array: T[], fn: (item: T) => string) {
    const result: T[] = []
    const existing: string[] = []
    console.log(array)
    for (const item of array) {
        const key = fn(item)
        if(key && !existing.includes(key)) {
            result.push(item)
            existing.push(key)
        }
    }
    return result
}