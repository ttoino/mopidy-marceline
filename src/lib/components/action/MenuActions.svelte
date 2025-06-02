<script lang="ts">
    import type { Actions } from "$lib/types/action";
    import type { ComponentProps } from "svelte";

    import { Menu, MenuList, MenuTrigger } from "svelte-m3c";

    import MenuAction from "./MenuAction.svelte";

    let {
        actions,
        child,
    }: {
        actions: Actions;
        child: ComponentProps<typeof MenuTrigger>["child"];
    } = $props();
</script>

<Menu type="context">
    <MenuTrigger {child} />

    <MenuList class="z-50">
        {#each actions as action, index (index)}
            <MenuAction {action} />
        {/each}
    </MenuList>
</Menu>
