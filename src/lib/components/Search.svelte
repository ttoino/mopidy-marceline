<script lang="ts">
    import { Icon, IconButton, SearchBar } from "svelte-m3c";
</script>

<div
    class="pointer-events-none sticky top-0 z-30 flex w-full flex-row justify-center px-4 pt-2 medium:pt-4"
>
    <SearchBar class="pointer-events-auto">
        {#snippet leading()}
            <IconButton containerClass="z-10 medium:hidden -m-2" icon="menu" />
            <Icon class="max-medium:hidden" icon="search" />
        {/snippet}
    </SearchBar>
</div>
