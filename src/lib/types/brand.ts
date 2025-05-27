export type Branded<T, B> = { __brand: B } & T;

export const brand = <T, B>(value: T): Branded<T, B> => value as Branded<T, B>;

export const brands = <T, B>(values: T[]): Branded<T, B>[] =>
    values as Branded<T, B>[];

export const unbrand = <T, B>(value: Branded<T, B>): T => value as T;

export const unbrands = <T, B>(values: Branded<T, B>[]): T[] => values as T[];
