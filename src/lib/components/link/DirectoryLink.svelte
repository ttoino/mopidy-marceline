<script lang="ts">
    import type { Directory } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import Link from "./Link.svelte";

    let {
        directory,
        ...props
    }: { directory: Directory } & Omit<
        ComponentProps<typeof Link>,
        "children" | "params" | "path"
    > = $props();
</script>

<Link
    params={{ directory: directory.uri ?? "" }}
    path="/library/[directory]"
    {...props}
>
    {directory.name}
</Link>
