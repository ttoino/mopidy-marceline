<script lang="ts">
    import type { ModelRef } from "$lib/types/mopidy";

    import RefListItem from "../item/RefListItem.svelte";
    import VirtualList from "./VirtualList.svelte";

    let { items }: { items: ModelRef[] } = $props();
</script>

<VirtualList data={items} getKey={(item) => item.uri}>
    {#snippet item(item)}
        <RefListItem {item} />
    {/snippet}
</VirtualList>
