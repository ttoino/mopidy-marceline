<script lang="ts">
    import TrackHero from "$lib/components/hero/TrackHero.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text={data.track.name} />
</svelte:head>

<TrackHero track={data.track} />

{#if data.lyrics}
    <div class="mx-4">
        <h2 class="mb-4 text-display-m">Lyrics</h2>

        {#each data.lyrics.plain as group, i (i)}
            <p class="mb-4 text-body-l">
                {#each group as line, j (j)}
                    {#if j > 0}
                        <br />
                    {/if}

                    {line}
                {/each}
            </p>
        {/each}
    </div>
{/if}
