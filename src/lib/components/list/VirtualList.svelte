<script generics="T" lang="ts">
    import type { Snippet } from "svelte";

    import { getScroll } from "$lib/context/scroll";
    import { List } from "svelte-m3c";
    import { Virtualizer } from "virtua/svelte";

    let {
        data,
        getKey = (_, index) => index,
        item,
    }: {
        data: T[];
        getKey: (item: T, index: number) => number | string;
        item: Snippet<[item: T, index: number]>;
    } = $props();

    let ref = $state<HTMLElement | null>(null);

    const scroll = getScroll();
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
            children={item}
            {data}
            {getKey}
            overscan={10}
            {scrollRef}
            {startMargin}
        />
    {/if}
</List>
