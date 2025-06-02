<script lang="ts">
    import type { HTMLAnchorAttributes } from "svelte/elements";

    import { base } from "$app/paths";

    let {
        children,
        class: className,
        contained = true,
        path,
        uri,
        ...props
    }: {
        contained?: boolean;
        path?: string;
        uri?: string;
    } & Omit<HTMLAnchorAttributes, "href"> = $props();

    let href = $derived.by(() => {
        let url = base;

        if (path) url += "/" + path;

        if (uri) url += "/" + encodeURIComponent(uri);

        return url;
    });
</script>

<a
    class="after:absolute after:inset-0 after:z-10 hover:underline {className}"
    class:relative={contained}
    {href}
    {...props}
>
    {@render children?.()}
</a>
