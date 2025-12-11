<script lang="ts">
  import Search from "./lib/components/Search.svelte";
  import Card from "./lib/components/Card.svelte";
  import Calendar from "./lib/components/Calendar.svelte";

  import { getHistoryByDay, type HistoryByDay } from "./lib/utils/chrome-api";
  import CardLoading from "./lib/components/CardLoading.svelte";

  let search: string = $state("");
  let selectedMoments: string[] = $state([]);
</script>

<header>
  <h1>Visual history</h1>
  <Search bind:value={search} />
</header>
<main>
  <Calendar data={getHistoryByDay(search, true)} bind:selectedMoments />
  <section class="days">
    {#if selectedMoments.length > 0}
      {#await getHistoryByDay(search)}
        <CardLoading />
        <CardLoading />
        <CardLoading />
      {:then history}
        {#each selectedMoments as date}
          <Card {date} items={history[date]} />
        {/each}
      {/await}
    {:else}
      {#await getHistoryByDay(search)}
        <CardLoading />
        <CardLoading />
        <CardLoading />
      {:then history}
        {#each Object.entries(history) as [date, items]}
          <Card {date} {items} />
        {/each}
      {:catch error}
        <p>Something went wrong: {error.message}</p>
      {/await}
    {/if}
  </section>
</main>

<style>
  header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
  }
  h1 {
    margin: 0;
    font-size: 1.375rem;
    position: absolute;
    display: none;
  }
  @media (min-width: 840px) {
    h1 {
      display: block;
    }
  }
  main {
    padding: 0 1rem 1rem 1rem;
    margin-inline: auto;
    max-width: 60rem;
  }
  .days {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
