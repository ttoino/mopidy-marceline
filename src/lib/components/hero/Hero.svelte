<script lang="ts">
    import type { Actions } from "$lib/types/action";
    import type { Snippet } from "svelte";

    import ButtonActions from "../action/ButtonActions.svelte";

    let {
        actions,
        image,
        info,
        subtitle,
        title,
    }: {
        actions?: Actions;
        image?: string;
        info?: Snippet;
        subtitle?: Snippet;
        title?: Snippet;
    } = $props();
</script>

<div class="flex flex-col items-stretch gap-8 p-4 pt-8 medium:flex-row">
    {#if image}
        <img class="h-auto w-full max-w-100 shrink-0 grow" alt="" src={image} />
    {/if}
    <div class="flex flex-grow flex-col items-start justify-center">
        {#if title}
            <h1 class="text-display-l">
                {@render title()}
            </h1>
        {/if}

        {#if subtitle}
            <span class="text-display-s text-on-surface-variant">
                {@render subtitle()}
            </span>
        {/if}

        {#if image && actions && actions.length > 0}
            <div class="not-first:h-4"></div>

            <ButtonActions {actions} />
        {/if}

        {#if info}
            <div
                class="text-middle flex flex-row flex-wrap gap-2 self-stretch text-body-l text-on-surface-variant *:min-w-[calc(50%---spacing(1))] not-first:mt-8"
            >
                {@render info()}
            </div>
        {/if}
    </div>
    {#if !image && actions && actions.length > 0}
        <ButtonActions {actions} />
    {/if}
</div>
