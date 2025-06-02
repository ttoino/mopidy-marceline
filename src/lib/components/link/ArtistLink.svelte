<script lang="ts">
    import type { Artist } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import Link from "./Link.svelte";

    let {
        artist,
        ...props
    }: { artist: Artist } & Omit<
        ComponentProps<typeof Link>,
        "children" | "path" | "uri"
    > = $props();
</script>

<Link path="artist" uri={artist.uri} {...props}>
    {artist.name}
</Link>
