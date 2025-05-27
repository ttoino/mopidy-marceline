<script lang="ts">
    import { getMopidy } from "$lib/context/mopidy";
    import type { AlbumWithTracks } from "$lib/types/mopidy";
    import TrackListActions from "../TrackListActions.svelte";
    import Hero from "./Hero.svelte";

    let {
        album,
    }: {
        album: AlbumWithTracks;
    } = $props();

    let mopidy = getMopidy();

    let image = $derived(mopidy.getImage(album.uri));
</script>

<Hero {image}>
    {#snippet title()}
        {album.name}
    {/snippet}

    {#snippet subtitle()}
        {album.artists.map((artist) => artist.name).join(", ")}
    {/snippet}

    {#snippet actions()}
        <TrackListActions tracks={album.tracks} />
    {/snippet}
</Hero>
