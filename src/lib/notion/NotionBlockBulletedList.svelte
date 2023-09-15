<script context="module" lang="ts">
    import type{ BlockRichText} from './notion.types'
    export type BlockBulletedListItem = {
        bulleted_list_item: {
            rich_text: Array<BlockRichText>
        },
        siblings: Array<{
            bulleted_list_item: {
                rich_text: Array<BlockRichText>
            }
        }>
    }
</script>

<script lang="ts">
    import NotionBlockRichText from './NotionBlockRichText.svelte'
    export let block: BlockBulletedListItem
</script>

<ul class="notion__block-type notion__bulleted-list">
    <li class="notion__bulleted-list-item"><NotionBlockRichText block={block.bulleted_list_item.rich_text} /></li>
    {#if block.siblings}
        {#each block.siblings as sibling}
            <li class="notion__bulleted-list-item"><NotionBlockRichText block={sibling.bulleted_list_item.rich_text} /></li>
        {/each}
    {/if}
</ul>

<style lang="postcss">
    .notion__bulleted-list {
        @apply list-disc ml-8;
    }
</style>
