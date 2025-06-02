<script lang="ts">
    import type { Actions } from "$lib/types/action";

    import {
        Button,
        IconButton,
        Menu,
        MenuList,
        MenuTrigger,
    } from "svelte-m3c";

    import MenuAction from "./MenuAction.svelte";

    let { actions }: { actions: Actions } = $props();

    let alwaysVisible = $derived.by(() => {
        const i = actions.findIndex((action) => "action" in action);

        if (i === -1) return [];

        return [i];
    });

    let alwaysHidden = $derived.by(() => {
        const r: number[] = [];
        let skipped = 0;

        actions.forEach((action, index) => {
            if ("actions" in action) r.push(index);
            else if (skipped < 3) skipped++;
            else r.push(index);
        });

        return r;
    });
</script>

<div class="flex flex-row items-center gap-2">
    {#each actions as action, index (index)}
        {#if !(index in alwaysHidden) && "action" in action}
            <Button
                containerClass={!(index in alwaysVisible)
                    ? "max-medium:hidden"
                    : ""}
                icon={action.icon}
                onclick={action.action}
                variant={index in alwaysVisible ? "filled" : "text"}
            >
                {action.label}
            </Button>
        {/if}
    {/each}

    <Menu type="dropdown">
        <MenuTrigger>
            {#snippet child({ props })}
                <IconButton
                    containerClass={alwaysHidden.length === 0
                        ? "medium:hidden"
                        : ""}
                    icon="more_horiz"
                    {...props}
                />
            {/snippet}
        </MenuTrigger>
        <MenuList>
            {#each actions as action, index (index)}
                {#if !(index in alwaysVisible)}
                    <MenuAction
                        {action}
                        containerClass={!(index in alwaysHidden)
                            ? "medium:hidden"
                            : ""}
                    />
                {/if}
            {/each}
        </MenuList>
    </Menu>
</div>
