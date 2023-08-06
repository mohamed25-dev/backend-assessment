export function timestampToUTC(unixTimestamp: number): Date {
    const milliseconds = unixTimestamp * 1000;
    const utcDate = new Date(milliseconds);

    return utcDate;
}