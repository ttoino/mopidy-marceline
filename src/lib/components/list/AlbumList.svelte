<script lang="ts">
    import type { AlbumRef } from "$lib/types/mopidy";

    import AlbumListItem from "../item/AlbumListItem.svelte";
    import VirtualList from "./VirtualList.svelte";

    let { albums }: { albums: AlbumRef[] } = $props();
</script>

<VirtualList data={albums} getKey={(album) => album.uri}>
    {#snippet item(album)}
        <AlbumListItem {album} />
    {/snippet}
</VirtualList>
