<script lang="ts">
    import type { Track } from "$lib/types/mopidy";

    import { SEPARATOR } from "$lib/constants";
    import { getMopidy } from "$lib/context/mopidy";

    import trackActions from "../action/trackActions";
    import AlbumLink from "../link/AlbumLink.svelte";
    import ArtistsLinks from "../link/ArtistsLinks.svelte";
    import TrackLink from "../link/TrackLink.svelte";
    import Hero from "./Hero.svelte";

    let {
        track,
    }: {
        track: Track;
    } = $props();

    const mopidy = getMopidy();

    let image = $derived(mopidy.getImage(track.uri));

    let actions = $derived(trackActions(mopidy, track));
</script>

<Hero {actions} {image}>
    {#snippet title()}
        <TrackLink {track} />
    {/snippet}

    {#snippet subtitle()}
        <ArtistsLinks artists={track.artists} />
        {SEPARATOR}
        <AlbumLink album={track.album} />
    {/snippet}
</Hero>
