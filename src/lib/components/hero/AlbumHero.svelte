<script lang="ts">
    import type { AlbumWithTracks } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";
    import { formatDate, formatDuration } from "$lib/format";

    import tracksActions from "../action/tracksActions";
    import AlbumLink from "../link/AlbumLink.svelte";
    import ArtistsLinks from "../link/ArtistsLinks.svelte";
    import Hero from "./Hero.svelte";
    import InfoChip from "./InfoChip.svelte";

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

    {#snippet info()}
        <InfoChip icon="person" tooltip="Artists">
            <ArtistsLinks artists={album.artists} />
        </InfoChip>
        <InfoChip icon="music_note" tooltip="Genre">
            {album.num_tracks} tracks{#if album.num_discs > 1}, {album.num_discs}
                discs{/if}
        </InfoChip>
        <InfoChip icon="calendar_today" tooltip="Release date">
            {formatDate(new Date(album.date))}
        </InfoChip>
        <InfoChip icon="timer" tooltip="Duration">
            {formatDuration(
                album.tracks.reduce((total, track) => total + track.length, 0),
            )}
        </InfoChip>
    {/snippet}
</Hero>
