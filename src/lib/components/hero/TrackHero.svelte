<script lang="ts">
    import { SEPARATOR } from "$lib/constants";
    import { getMopidy } from "$lib/context/mopidy";
    import type { Track } from "$lib/types/mopidy";
    import TrackListActions from "../TrackListActions.svelte";
    import Hero from "./Hero.svelte";

    let {
        track,
    }: {
        track: Track;
    } = $props();

    let mopidy = getMopidy();

    let image = $derived(mopidy.getImage(track.uri));
</script>

<Hero {image}>
    {#snippet title()}
        {track.name}
    {/snippet}

    {#snippet subtitle()}
        {track.artists.map((artist) => artist.name).join(", ")}
        {SEPARATOR}
        {track.album.name}
    {/snippet}

    {#snippet actions()}
        <TrackListActions tracks={[track]} />
    {/snippet}
</Hero>
