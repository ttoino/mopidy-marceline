import type { Pathname, RouteId, RouteParams } from "$app/types";

import { resolve as baseResolve } from "$app/paths";

type ResolveArgs<T extends Pathname | RouteId> = T extends RouteId
    ? RouteParams<T> extends Record<string, never>
        ? [route: T]
        : [route: T, params: RouteParams<T>]
    : [route: T];

const encodeResolve = <T extends Pathname | RouteId>(
    ...args: ResolveArgs<T>
): ResolveArgs<T> => {
    if (args.length === 1) return args;

    const [route, params] = args;
    const encodedParams = {} as typeof params;

    for (const key in params) {
        const value = params[key as keyof typeof params];
        // @ts-expect-error: Impossible to type
        encodedParams[key as keyof typeof params] = Array.isArray(value)
            ? // @ts-expect-error: Impossible to type
              value.map((v) => encodeURIComponent(v))
            : encodeURIComponent(value);
    }

    return [route, encodedParams] as ResolveArgs<T>;
};

export const resolve = <T extends Pathname | RouteId>(
    ...args: ResolveArgs<T>
) => baseResolve(...encodeResolve<T>(...args));
