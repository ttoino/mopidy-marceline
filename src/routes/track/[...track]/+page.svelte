<script lang="ts">
    import TrackHero from "$lib/components/hero/TrackHero.svelte";
    import Title from "$lib/components/Title.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <Title text={data.track.name} />
</svelte:head>

<TrackHero track={data.track} />

{#if data.lyrics && data.lyrics.plain.length > 0}
    <div class="mx-4">
        <h2 class="text-display-m mb-4">Lyrics</h2>

        <div class="columns-[40ch]">
            {#each data.lyrics.plain as group, i (i)}
                <p class="text-body-l mb-4 break-inside-avoid">
                    {#each group as line, j (j)}
                        {#if j > 0}
                            <br />
                        {/if}

                        {line}
                    {/each}
                </p>
            {/each}
        </div>
    </div>
{/if}
