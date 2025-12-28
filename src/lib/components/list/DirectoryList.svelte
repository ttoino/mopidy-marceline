<script lang="ts">
    import type { DirectoryRef } from "$lib/types/mopidy";

    import DirectoryListItem from "../item/DirectoryListItem.svelte";
    import VirtualList from "./VirtualList.svelte";

    let { directories }: { directories: DirectoryRef[] } = $props();
</script>

<VirtualList data={directories} getKey={(directory) => directory.uri ?? ""}>
    {#snippet item(directory)}
        <DirectoryListItem {directory} />
    {/snippet}
</VirtualList>
