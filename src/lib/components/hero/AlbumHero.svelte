<script lang="ts">
    import type { AlbumWithTracks } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";

    import tracksActions from "../action/tracksActions";
    import AlbumLink from "../link/AlbumLink.svelte";
    import ArtistsLinks from "../link/ArtistsLinks.svelte";
    import Hero from "./Hero.svelte";

    let {
        album,
    }: {
        album: AlbumWithTracks;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getImage(album.uri));

    let actions = $derived(tracksActions(mopidy, album.tracks));
</script>

<Hero {actions} {image}>
    {#snippet title()}
        <AlbumLink {album} />
    {/snippet}

    {#snippet subtitle()}
        <ArtistsLinks artists={album.artists} />
    {/snippet}
</Hero>
