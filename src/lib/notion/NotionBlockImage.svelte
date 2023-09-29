<script context="module" lang="ts">
    import { notionAssetUrl2Api } from './notion.utils'
    export type BlockImage = {
        image: {
            file: {
                url: string
            },
            external: {
                url: string
            }
        }
    }
</script>

<script lang="ts">
    export let block: BlockImage
</script>

<div class="notion__block-type notion__image h-auto max-w-full">
    {#if block.image && block.image.file && block.image.file.url}
        <img class="h-auto w-full" src="/notionAssets/assets/{notionAssetUrl2Api(block.image.file.url)}">
    {/if}
    {#if block.image && block.image.external && block.image.external.url}
        <img class="h-auto w-full" src="/assets/{encodeURIComponent(block.image.external.url)}">
    {/if}
</div>

<style lang="postcss">
    .notion__image {
        
    }
</style>
