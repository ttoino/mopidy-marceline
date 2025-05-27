<script lang="ts">
    import type { Playlist } from "$lib/types/mopidy";

    import PlaylistListItem from "../item/PlaylistListItem.svelte";
    import VirtualList from "./VirtualList.svelte";

    let { playlists }: { playlists: Playlist[] } = $props();
</script>

<VirtualList data={playlists} getKey={(playlist) => playlist.uri}>
    {#snippet item(playlist)}
        <PlaylistListItem {playlist} />
    {/snippet}
</VirtualList>
