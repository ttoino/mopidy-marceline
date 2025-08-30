<script lang="ts">
    import type { Album } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import Link from "./Link.svelte";

    let {
        album,
        ...props
    }: { album: Album } & Omit<
        ComponentProps<typeof Link>,
        "children" | "params" | "path"
    > = $props();
</script>

<Link params={{ album: album.uri }} path="/album/[album]" {...props}>
    {album.name}
</Link>
