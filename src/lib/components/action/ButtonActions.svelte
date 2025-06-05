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
        const i = actions.findIndex(
            (action) => action !== "divider" && "action" in action,
        );

        if (i === -1) return [];

        return [i];
    });

    let alwaysHidden = $derived.by(() => {
        const r: number[] = [];
        let skipped = 0;

        actions.forEach((action, index) => {
            if (r.length === 0 && action === "divider") return;
            else if (
                action === "divider" ||
                "actions" in action ||
                skipped >= 3
            )
                r.push(index);
            else skipped++;
        });

        return r;
    });
</script>

<div class="flex flex-row items-center gap-2">
    {#each actions as action, index (index)}
        {#if !alwaysHidden.includes(index) && action !== "divider" && "action" in action}
            <Button
                containerClass={!(index in alwaysVisible)
                    ? "max-medium:hidden"
                    : ""}
                icon={action.icon}
                onclick={action.action}
                variant={alwaysVisible.includes(index) ? "filled" : "text"}
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
                        class={!alwaysHidden.includes(index)
                            ? "medium:hidden"
                            : ""}
                        {action}
                    />
                {/if}
            {/each}
        </MenuList>
    </Menu>
</div>
