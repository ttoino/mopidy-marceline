<script lang="ts">
    import type { Actions } from "$lib/types/action";
    import type { ComponentProps } from "svelte";

    import { mergeProps } from "bits-ui";
    import { ListItem } from "svelte-m3c";

    import MenuActions from "../action/MenuActions.svelte";

    let {
        actions,
        ...rest
    }: { actions: Actions } & ComponentProps<typeof ListItem> = $props();
</script>

<MenuActions {actions}>
    {#snippet trigger({ props })}
        <ListItem {...mergeProps(rest, props)} />
    {/snippet}
</MenuActions>
