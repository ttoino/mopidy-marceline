<script lang="ts">
    import TrackHero from "$lib/components/hero/TrackHero.svelte";
    import Title from "$lib/components/Title.svelte";
    import { getMopidy } from "$lib/context/mopidy.js";
    import { Progress } from "svelte-m3c";

    let { data } = $props();

    const mopidy = getMopidy();
</script>

<svelte:head>
    <Title text={data.track.name} />
</svelte:head>

<TrackHero track={data.track} />

<div class="mx-4">
    <h2 class="mb-4 text-display-m">Lyrics</h2>
    <svelte:boundary>
        {#snippet pending()}
            <Progress circular value={null} />
        {/snippet}

        {#snippet failed()}
            Error getting lyrics
        {/snippet}

        {@const lyrics = await mopidy.getLyrics(data.track.uri)}

        {#if lyrics.plain.length > 0}
            <div class="columns-[40ch]">
                {#each lyrics.plain as group, i (i)}
                    <p class="mb-4 text-body-l not-only:break-inside-avoid">
                        {#each group as line, j (j)}
                            {#if j > 0}
                                <br />
                            {/if}

                            {line}
                        {/each}
                    </p>
                {/each}
            </div>
        {:else}
            Lyrics not available
        {/if}
    </svelte:boundary>
</div>
