<script lang="ts">
    import type { Snippet } from "svelte";

    import { Icon, type IconName, Tooltip } from "svelte-m3c";

    let {
        children,
        icon,
        tooltip,
    }: {
        children: Snippet;
        icon?: IconName;
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
