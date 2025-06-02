<script lang="ts">
    import type { Directory } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import Link from "./Link.svelte";

    let {
        directory,
        ...props
    }: { directory: Directory } & Omit<
        ComponentProps<typeof Link>,
        "children" | "path" | "uri"
    > = $props();
</script>

<Link path="directory" uri={directory.uri ?? undefined} {...props}>
    {directory.name}
</Link>
