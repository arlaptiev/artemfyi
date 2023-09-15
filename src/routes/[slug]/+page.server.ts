import { getPage, getBlocks, getSupportedBlocks, getAsSensiblyStructuredBlocks } from '$lib/notion'
import { error } from '@sveltejs/kit';


export type ParamsType = { slug: string }


/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function load({ params }: { params: ParamsType }) {
  const { slug } = params;

  try {
    const blocks = await getBlocks(slug);

    const page = await getPage(slug);

    if (blocks) {
      return {
        blocks: getAsSensiblyStructuredBlocks(getSupportedBlocks(blocks)),
        page: page
      }
    } else {
      throw error(404);
    }
  } catch {
    throw error(404);
  }
}