<script lang="ts">
    import type { Actions } from "$lib/types/action";
    import type { Snippet } from "svelte";

    import ButtonActions from "../action/ButtonActions.svelte";

    let {
        actions,
        image,
        subtitle,
        title,
    }: {
        actions: Actions;
        image?: string;
        subtitle: Snippet;
        title: Snippet;
    } = $props();
</script>

<div class="flex flex-col items-stretch gap-8 p-4 pt-8 medium:flex-row">
    {#if image}
        <img class="h-auto w-full max-w-100 shrink-0 grow" alt="" src={image} />
    {/if}
    <div class="flex flex-col justify-center items-start">
        <h1 class="text-display-l">
            {@render title()}
        </h1>
        <span class="mb-4 text-display-s text-on-surface-variant">
            {@render subtitle()}
        </span>

        <ButtonActions {actions} />
    </div>
</div>
