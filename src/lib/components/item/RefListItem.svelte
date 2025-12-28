<script lang="ts">
    import type { ModelRef } from "$lib/types/mopidy";

    import AlbumListItem from "./AlbumListItem.svelte";
    import ArtistListItem from "./ArtistListItem.svelte";
    import DirectoryListItem from "./DirectoryListItem.svelte";
    import PlaylistListItem from "./PlaylistListItem.svelte";
    import TrackListItem from "./TrackListItem.svelte";

    let { item }: { item: ModelRef } = $props();
</script>

{#if item.type === "directory"}
    <DirectoryListItem directory={item} />
{:else if item.type === "album"}
    <AlbumListItem album={item} />
{:else if item.type === "artist"}
    <ArtistListItem artist={item} />
{:else if item.type === "track"}
    <TrackListItem track={item} />
{:else if item.type === "playlist"}
    <PlaylistListItem playlist={item} />
{/if}
