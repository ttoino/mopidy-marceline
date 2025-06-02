<script lang="ts">
    import type { Artist } from "$lib/types/mopidy";
    import type { ComponentProps } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    import ArtistLink from "./ArtistLink.svelte";

    let {
        artists,
        linkProps = {},
        ...props
    }: {
        artists: Artist[];
        linkProps?: Omit<ComponentProps<typeof ArtistLink>, "artist">;
    } & Omit<HTMLAttributes<HTMLSpanElement>, "children"> = $props();
</script>

<span {...props}>
    {#each artists as artist, index (artist.uri)}
        {#if index > 0}
            <span>, </span>
        {/if}

        <ArtistLink {artist} {...linkProps} />
    {/each}
</span>
