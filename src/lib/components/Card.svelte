<script lang="ts">
  import Item from "./Item.svelte";
  const { date, items }: { date: string; items: chrome.history.HistoryItem[] } =
    $props();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  // Todo: if time between items is longer than 20 minutes render a
  // vertical separator of one line height
</script>

<article class="card">
  <header>
    <h3>
      {items[0]?.lastVisitTime
        ? new Date(items[0].lastVisitTime).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : date}
    </h3>
  </header>
  <ol>
    {#each items as item}
      <Item
        selected={false}
        time={item.lastVisitTime.toString()}
        title={item.title}
        url={item.url}
        domain={new URL(item.url).hostname}
      />
    {/each}
  </ol>
</article>

<style>
  ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
