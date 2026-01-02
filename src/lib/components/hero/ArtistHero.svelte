<script lang="ts">
    import type { ArtistWithAlbumsAndTracks } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";

    import artistActions from "../action/artistActions";
    import ArtistLink from "../link/ArtistLink.svelte";
    import Hero from "./Hero.svelte";

    let {
        artist,
    }: {
        artist: ArtistWithAlbumsAndTracks;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getMainImage(artist.uri));

    let actions = $derived(artistActions(mopidy, artist));
</script>

<Hero {actions} {image}>
    {#snippet title()}
        <ArtistLink {artist} />
    {/snippet}
</Hero>
