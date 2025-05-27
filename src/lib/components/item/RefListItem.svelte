<script lang="ts">
    import type { ModelRef } from "$lib/types/mopidy";

    import { getMopidy } from "$lib/context/mopidy";

    import AlbumListItem from "./AlbumListItem.svelte";
    import ArtistListItem from "./ArtistListItem.svelte";
    import DirectoryListItem from "./DirectoryListItem.svelte";
    import PlaylistListItem from "./PlaylistListItem.svelte";
    import TrackListItem from "./TrackListItem.svelte";

    let { item }: { item: ModelRef } = $props();

    const mopidy = getMopidy();
</script>

{#if item.type === "directory"}
    {@const directory = mopidy.getDirectory(item.uri)}

    {#if directory}
        <DirectoryListItem {directory} />
    {/if}
{:else if item.type === "album"}
    {@const album = mopidy.getAlbum(item.uri)}

    {#if album}
        <AlbumListItem {album} />
    {/if}
{:else if item.type === "artist"}
    {@const artist = mopidy.getArtist(item.uri)}

    {#if artist}
        <ArtistListItem {artist} />
    {/if}
{:else if item.type === "track"}
    {@const track = mopidy.getTrack(item.uri)}

    {#if track}
        <TrackListItem {track} />
    {/if}
{:else if item.type === "playlist"}
    {@const playlist = mopidy.getPlaylist(item.uri)}

    {#if playlist}
        <PlaylistListItem {playlist} />
    {/if}
{/if}
