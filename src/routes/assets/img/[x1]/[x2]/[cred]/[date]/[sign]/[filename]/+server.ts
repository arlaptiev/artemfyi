export const prerender = true;

export type NotionImgParams = {
  x1: string;
  x2: string;
  cred: string;
  date: string;
  sign: string;
  filename: string;
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ params }: { params: NotionImgParams }) {
  const { x1, x2, cred, date, sign, filename } = params;
  return fetch(`https://prod-files-secure.s3.us-west-2.amazonaws.com/${x1}/${x2}/${filename}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=${cred}&X-Amz-Date=${date}&X-Amz-Expires=3600&X-Amz-Signature=${sign}&X-Amz-SignedHeaders=host&x-id=GetObject`);
}