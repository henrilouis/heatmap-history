<script lang="ts">
  let {
    selected = $bindable(),
    time,
    title,
    url,
    domain,
  }: {
    selected: boolean;
    time: string;
    title: string;
    url: string;
    domain: string;
  } = $props();

  import { getFaviconURL, deleteHistoryUrl } from "../utils/chrome-api";
</script>

<li>
  <time
    >{new Date(parseFloat(time)).toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
    })}</time
  >
  <img src={getFaviconURL(domain)} alt={`Favicon for ${domain}`} />
  <div>
    <a href={url}>{title}</a>
    <span class="text-secondary">{domain}</span>
  </div>
  <button class="quiet" onclick={() => deleteHistoryUrl(url)}>Delete</button>
</li>

<style>
  li {
    font-size: 0.75rem;
    display: grid;
    grid-template-columns: 4rem 16px 1fr auto;
    align-items: center;
    gap: 0.5rem;
    padding-block: 0.25rem;
    border-bottom: var(--el-border-width) solid var(--el-border-color-default);
  }
</style>
