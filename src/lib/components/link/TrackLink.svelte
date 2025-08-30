<script lang="ts">
    import type { Track } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import Link from "./Link.svelte";

    let {
        track,
        ...props
    }: { track: Track } & Omit<
        ComponentProps<typeof Link>,
        "children" | "params" | "path"
    > = $props();
</script>

<Link params={{ track: track.uri }} path="/track/[track]" {...props}>
    {track.name}
</Link>
