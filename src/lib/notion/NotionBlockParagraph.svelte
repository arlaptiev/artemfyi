<script context="module" lang="ts">
    import type{ BlockRichText } from './notion.types'
    export type BlockParagraph = {
        rich_text: Array<BlockRichText>
    }
</script>

<script lang="ts">
    import NotionBlockRichText from './NotionBlockRichText.svelte'
    export let block: BlockParagraph
</script>

<p class="notion__block-type notion__paragraph">
    {#if block.rich_text && block.rich_text.length}
        <NotionBlockRichText block={block.rich_text} />
    {:else}
        <br/>
    {/if}
</p>

<style lang="postcss">
    .notion__paragraph {
        
    }
</style>
