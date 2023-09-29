<script context="module" lang="ts">
    import { notionAssetUrl2Api } from './notion.utils'
    export type BlockVideo = {
        video: {
            file: {
                url: string
            }
        }
    }
</script>

<script lang="ts">
    export let block: BlockVideo
</script>

<div class="notion__block-type notion__video h-auto max-w-full">
    {#if block.video && block.video.file && block.video.file.url}
        <video class="h-auto w-full" src="/notionAssets/assets/{notionAssetUrl2Api(block.video.file.url)}" controls>
            <track kind="captions" />
            Your browser does not support the video tag.
        </video>
    {/if}
</div>

<style lang="postcss">
    .notion__video {
        
    }
</style>
