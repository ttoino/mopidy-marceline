<script lang="ts">
    import type { Track } from "$lib/types/mopidy";

    import { SEPARATOR } from "$lib/constants";
    import { getMopidy } from "$lib/context/mopidy";
    import { formatDate, formatDuration } from "$lib/format";

    import trackActions from "../action/trackActions";
    import AlbumLink from "../link/AlbumLink.svelte";
    import ArtistsLinks from "../link/ArtistsLinks.svelte";
    import TrackLink from "../link/TrackLink.svelte";
    import Hero from "./Hero.svelte";
    import InfoChip from "./InfoChip.svelte";

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

    {#snippet info()}
        <InfoChip icon="album" tooltip="Album">
            <AlbumLink album={track.album} /> (#{track.track_no})
        </InfoChip>
        <InfoChip icon="person" tooltip="Artists">
            <ArtistsLinks artists={track.artists} />
        </InfoChip>
        {#if track.performers?.length > 0}
            <InfoChip icon="artist" tooltip="Performers">
                <ArtistsLinks artists={track.performers} />
            </InfoChip>
        {/if}
        {#if track.composers?.length > 0}
            <InfoChip icon="person_edit" tooltip="Composers">
                <ArtistsLinks artists={track.composers} />
            </InfoChip>
        {/if}
        {#if track.genre}
            <InfoChip icon="music_note" tooltip="Genre">
                {track.genre}
            </InfoChip>
        {/if}
        <InfoChip icon="calendar_today" tooltip="Release date">
            {formatDate(new Date(track.date))}
        </InfoChip>
        <InfoChip icon="timer" tooltip="Duration">
            {formatDuration(track.length)}
        </InfoChip>
    {/snippet}
</Hero>
