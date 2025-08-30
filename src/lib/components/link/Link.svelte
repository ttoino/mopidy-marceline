<script generics="T extends Pathname | RouteId" lang="ts">
    import type { Pathname, RouteId, RouteParams } from "$app/types";
    import type { HTMLAnchorAttributes } from "svelte/elements";

    import { resolve } from "$lib/navigation";

    let {
        children,
        class: className,
        contained = true,
        params,
        path,
        ...props
    }: {
        contained?: boolean;
        params: T extends RouteId
            ? RouteParams<T> extends Record<string, never>
                ? undefined
                : RouteParams<T>
            : undefined;
        path: T;
    } & Omit<HTMLAnchorAttributes, "href"> = $props();

    // @ts-expect-error: Generics don't work here
    let href = $derived(resolve(path, params));
</script>

<a
    class="after:absolute after:inset-0 after:z-10 hover:underline {className}"
    class:relative={contained}
    {href}
    {...props}
>
    {@render children?.()}
</a>
