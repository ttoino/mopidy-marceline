<script lang="ts">
    import type { Actions } from "$lib/types/action";

    import {
        Button,
        Icon,
        IconButton,
        Menu,
        StandardButtonGroup,
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

<StandardButtonGroup color="secondary" variant="tonal">
    {#each actions as action, index (index)}
        {#if !alwaysHidden.includes(index) && action !== "divider" && "action" in action}
            <Button
                color={alwaysVisible.includes(index) ? "primary" : undefined}
                containerClass={!alwaysVisible.includes(index)
                    ? "max-medium:hidden"
                    : ""}
                onclick={action.action}
                variant={alwaysVisible.includes(index) ? "filled" : undefined}
            >
                <Icon icon={action.icon} />
                {action.label}
            </Button>
        {/if}
    {/each}

    <Menu strategy="dropdown">
        {#snippet trigger({ props })}
            <IconButton
                containerClass={alwaysHidden.length === 0
                    ? "medium:hidden"
                    : ""}
                icon="keyboard_arrow_down"
                {...props}
            />
        {/snippet}

        {#each actions as action, index (index)}
            {#if !(index in alwaysVisible)}
                <MenuAction
                    class={!alwaysHidden.includes(index) ? "medium:hidden" : ""}
                    {action}
                />
            {/if}
        {/each}
    </Menu>
</StandardButtonGroup>
