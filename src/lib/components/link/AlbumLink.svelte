<script lang="ts">
    import type { Album } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import Link from "./Link.svelte";

    let {
        album,
        ...props
    }: { album: Album } & Omit<
        ComponentProps<typeof Link>,
        "children" | "path" | "uri"
    > = $props();
</script>

<Link path="album" uri={album.uri} {...props}>
    {album.name}
</Link>
