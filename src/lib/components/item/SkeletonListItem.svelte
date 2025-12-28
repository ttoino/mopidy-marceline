<script lang="ts">
    import type { Snippet } from "svelte";

    import { ListItem } from "svelte-m3c";

    let {
        children,
    }: {
        children?: Snippet;
    } = $props();
</script>

<svelte:boundary>
    {@render children?.()}

    {#snippet pending()}
        <ListItem lines={1}>
            {#snippet leading()}
                <img
                    class="aspect-square animate-pulse rounded-xs bg-on-surface-variant object-cover"
                    alt="Loading..."
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                />
            {/snippet}
            {#snippet labelText()}
                <span class="w-40 bg-on-surface-variant"></span>
            {/snippet}
            {#snippet supportingText()}
                <span class="w-20 bg-on-surface-variant"></span>
            {/snippet}
            {#snippet trailing()}
                <span class="w-10 bg-on-surface-variant"></span>
            {/snippet}
        </ListItem>
    {/snippet}
</svelte:boundary>
