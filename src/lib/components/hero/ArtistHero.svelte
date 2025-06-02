<script lang="ts">
    import type { Artist } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";

    import ArtistLink from "../link/ArtistLink.svelte";
    import Hero from "./Hero.svelte";

    let {
        artist,
    }: {
        artist: Artist;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getImage(artist.uri));
</script>

<Hero actions={[]} {image}>
    {#snippet title()}
        <ArtistLink {artist} />
    {/snippet}

    {#snippet subtitle()}{/snippet}
</Hero>
