<script lang="ts">
    import type { Playlist } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import Link from "./Link.svelte";

    let {
        playlist,
        ...props
    }: { playlist: Playlist } & Omit<
        ComponentProps<typeof Link>,
        "children" | "params" | "path"
    > = $props();
</script>

<Link
    params={{ playlist: playlist.uri }}
    path="/playlist/[playlist]"
    {...props}
>
    {playlist.name}
</Link>
