<script lang="ts" context="module">
  import type{ Block, BlocksType, PageType } from '$lib/notion'
  import NotionBlock from '$lib/notion/NotionBlock.svelte'
</script>

<script lang="ts">
  import SvelteSeo from 'svelte-seo'

  export let data: {
    blocks: BlocksType
    page: PageType
  }
</script>


<SvelteSeo
  title={data.page.properties.title.title[0].plain_text}
  description="Project"
/>


<section>
  <div class="post">
    <!-- {JSON.stringify(data.blocks)}
    {JSON.stringify(data.page)} -->
    {#each data.blocks as block}
      <NotionBlock block={block} />
    {/each}
  </div>
</section>
