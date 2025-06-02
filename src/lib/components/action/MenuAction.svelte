<script lang="ts">
    import type { Action, ActionGroup } from "$lib/types/action";
    import type { ComponentProps } from "svelte";

    import { Icon, MenuItem } from "svelte-m3c";

    let {
        action,
        ...props
    }: { action: Action | ActionGroup } & Omit<
        ComponentProps<typeof MenuItem>,
        "leading" | "onSelect" | "text"
    > = $props();
</script>

{#if "action" in action}
    <MenuItem onSelect={action.action} {...props}>
        {#snippet text()}
            {action.label}
        {/snippet}
        {#snippet leading()}
            <Icon icon={action.icon} />
        {/snippet}
    </MenuItem>
{/if}
