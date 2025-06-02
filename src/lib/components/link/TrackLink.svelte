<script lang="ts">
    import type { Track } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import Link from "./Link.svelte";

    let {
        track,
        ...props
    }: { track: Track } & Omit<
        ComponentProps<typeof Link>,
        "children" | "path" | "uri"
    > = $props();
</script>

<Link path="track" uri={track.uri} {...props}>
    {track.name}
</Link>
