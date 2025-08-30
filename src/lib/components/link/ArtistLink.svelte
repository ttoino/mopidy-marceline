<script lang="ts">
    import type { Artist } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";

    import Link from "./Link.svelte";

    let {
        artist,
        ...props
    }: { artist: Artist } & Omit<
        ComponentProps<typeof Link>,
        "children" | "params" | "path"
    > = $props();
</script>

<Link params={{ artist: artist.uri }} path="/artist/[artist]" {...props}>
    {artist.name}
</Link>
