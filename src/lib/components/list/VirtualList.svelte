<script lang="ts" generics="T">
    import { getScroll } from "$lib/context/scroll";
    import type { Snippet } from "svelte";
    import { List } from "svelte-m3c";
    import { Virtualizer } from "virtua/svelte";

    let {
        data,
        getKey = (_, index) => index,
        item,
    }: {
        data: T[];
        getKey: (item: T, index: number) => string | number;
        item: Snippet<[item: T, index: number]>;
    } = $props();

    let ref = $state<HTMLElement | null>(null);

    let scroll = getScroll();
    let scrollRef = $derived(scroll());

    let startMargin = $derived(
        ref && scrollRef
            ? ref.getBoundingClientRect().top -
                  scrollRef.getBoundingClientRect().top
            : 0,
    );
</script>

<List bind:ref>
    {#if scrollRef}
        <Virtualizer
            {data}
            {getKey}
            overscan={10}
            {scrollRef}
            {startMargin}
            children={item}
        />
    {/if}
</List>
