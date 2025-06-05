<script lang="ts">
    import type { Action } from "$lib/types/action";

    import { Icon, Menu, MenuDivider, MenuItem, MenuList } from "svelte-m3c";

    import MenuAction from "./MenuAction.svelte";

    let { action, class: className }: { action: Action; class?: string } =
        $props();
</script>

{#if action === "divider"}
    <MenuDivider class={className} />
{:else if "action" in action}
    <MenuItem containerClass={className} onSelect={action.action}>
        {#snippet text()}
            {action.label}
        {/snippet}
        {#snippet leading()}
            <Icon icon={action.icon} />
        {/snippet}
    </MenuItem>
{:else}
    <Menu>
        <MenuItem containerClass={className}>
            {#snippet text()}
                {action.label}
            {/snippet}
            {#snippet leading()}
                <Icon icon={action.icon} />
            {/snippet}
        </MenuItem>
        <MenuList>
            {#each action.actions as subAction, index (index)}
                <MenuAction action={subAction} />
            {/each}
        </MenuList>
    </Menu>
{/if}
