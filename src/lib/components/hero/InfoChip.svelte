<script lang="ts">
    import type { MaterialSymbol } from "material-symbols";
    import type { Snippet } from "svelte";

    import { Icon, Tooltip } from "svelte-m3c";

    let {
        children,
        icon,
        tooltip,
    }: {
        children: Snippet;
        icon?: MaterialSymbol;
        tooltip?: string;
    } = $props();
</script>

<p>
    {#if icon && tooltip}
        <Tooltip>
            {#snippet trigger({ props })}
                <Icon {icon} {...props} />
            {/snippet}

            {tooltip}
        </Tooltip>
    {:else if icon}
        <Icon {icon} />
    {/if}

    {@render children()}
</p>
