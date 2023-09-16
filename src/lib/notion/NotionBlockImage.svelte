<script context="module" lang="ts">
    export type BlockImage = {
        image: {
            file: {
                url: string
            },
        }
    }
</script>

<script lang="ts">
    export let block: BlockImage

    function notionImageUrl2Api(url) {
        const [_, __, ___, x1, x2, rest] = url.split('/')
        const [filename, ____] = rest.split('?')

        const params = new URLSearchParams(url);
        const cred = params.get('X-Amz-Credential').split('/')[0];
        const date = params.get('X-Amz-Date');
        const sign = params.get('X-Amz-Signature');
        
        return `${x1}/${x2}/${cred}/${date}/${sign}/${filename}`
    }
</script>

<div class="notion__block-type notion__image h-auto max-w-full">
    {#if block.image && block.image.file && block.image.file.url}
        <img class="h-auto w-full" src="/assets/img/{notionImageUrl2Api(block.image.file.url)}">
    {/if}
</div>

<style lang="postcss">
    .notion__image {
        
    }
</style>
