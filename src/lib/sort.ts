export const sortByDate = <T extends { date: Date | number | string }>(
    arr: T[],
): T[] =>
    arr.toSorted(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
