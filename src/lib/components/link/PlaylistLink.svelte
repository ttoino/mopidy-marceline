<script lang="ts">
    import type { Playlist } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import Link from "./Link.svelte";

    let {
        playlist,
        ...props
    }: { playlist: Playlist } & Omit<
        ComponentProps<typeof Link>,
        "children" | "path" | "uri"
    > = $props();
</script>

<Link path="playlist" uri={playlist.uri} {...props}>
    {playlist.name}
</Link>
