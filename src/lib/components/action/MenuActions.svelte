<script lang="ts">
    import type { Actions } from "$lib/types/action";
    import type { ComponentProps } from "svelte";

    import { Menu } from "svelte-m3c";

    import MenuAction from "./MenuAction.svelte";

    let {
        actions,
        trigger,
    }: {
        actions: Actions;
        trigger: ComponentProps<typeof Menu>["trigger"];
    } = $props();
</script>

<Menu strategy="context" {trigger}>
    {#each actions as action, index (index)}
        <MenuAction {action} />
    {/each}
</Menu>
