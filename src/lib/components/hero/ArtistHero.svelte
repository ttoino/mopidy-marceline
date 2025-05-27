<script lang="ts">
    import { getMopidy } from "$lib/context/mopidy";
    import type { Artist } from "$lib/types/mopidy";
    import Hero from "./Hero.svelte";

    let {
        artist,
    }: {
        artist: Artist;
    } = $props();

    let mopidy = getMopidy();

    let image = $derived(mopidy.getImage(artist.uri));
</script>

<Hero {image}>
    {#snippet title()}
        {artist.name}
    {/snippet}

    {#snippet subtitle()}{/snippet}

    {#snippet actions()}{/snippet}
</Hero>
