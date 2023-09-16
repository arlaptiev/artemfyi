<script context="module" lang="ts">
    import type { BlockRichText } from './notion.types'
</script>

<script lang="ts">
    export let block: Array<BlockRichText>
</script>

{#each block as blockItem}
    {#if blockItem.text}
        <span class:font-bold={blockItem.annotations.bold}
            class:italic={blockItem.annotations.italic}
            class:strikethrough={blockItem.annotations.strikethrough}
            class:underline={blockItem.annotations.underline}
            class:code={blockItem.annotations.code}
            class="{blockItem.annotations.color !== 'default' ? blockItem.annotations.color : ''} notion__block-type notion__rich-text-item">
            
            {#if blockItem.text.link}
                <a href={blockItem.text.link.url} title={blockItem.text.content}>{blockItem.text.content}</a><!-- remove spaces
            -->{:else}
                {blockItem.text.content}
            {/if}<!-- remove spaces
        --></span>
    {/if}
{/each}
