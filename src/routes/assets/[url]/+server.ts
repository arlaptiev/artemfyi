export const prerender = true;

export type NotionImgParams = {
  url: string;
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 * TODO FIX UGLY NAMING OF THE SAVED FILE (!)
 * TODO ADD VIDEO BLOCKS
 */
export async function GET({  params }) {
  const { url } = params;
  return fetch(url);
}

const mimeTypes = {
  'audio/aac': '.aac',
  'application/x-abiword': '.abw',
  'application/x-freearc': '.arc',
  'image/avif': '.avif',
  'video/x-msvideo': '.avi',
  'application/vnd.amazon.ebook': '.azw',
  'application/octet-stream': '.bin',
  'image/bmp': '.bmp',
  'application/x-bzip': '.bz',
  'application/x-bzip2': '.bz2',
  'application/x-cdf': '.cda',
  'application/x-csh': '.csh',
  'text/css': '.css',
  'text/csv': '.csv',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-fontobject': '.eot',
  'application/epub+zip': '.epub',
  'application/gzip': '.gz',
  'image/gif': '.gif',
  'text/html': '.htm, .html',
  'image/vnd.microsoft.icon': '.ico',
  'text/calendar': '.ics',
  'application/java-archive': '.jar',
  'image/jpeg': '.jpeg, .jpg',
  'text/javascript (Specifications: HTML and RFC 9239)': '.js',
  'application/json': '.json',
  'application/ld+json': '.jsonld',
  'audio/midi, audio/x-midi': '.mid, .midi',
  'text/javascript': '.mjs',
  'audio/mpeg': '.mp3',
  'video/mp4': '.mp4',
  'video/mpeg': '.mpeg',
  'application/vnd.apple.installer+xml': '.mpkg',
  'application/vnd.oasis.opendocument.presentation': '.odp',
  'application/vnd.oasis.opendocument.spreadsheet': '.ods',
  'application/vnd.oasis.opendocument.text': '.odt',
  'audio/ogg': '.oga',
  'video/ogg': '.ogv',
  'application/ogg': '.ogx',
  'audio/opus': '.opus',
  'font/otf': '.otf',
  'image/png': '.png',
  'application/pdf': '.pdf',
  'application/x-httpd-php': '.php',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'application/vnd.rar': '.rar',
  'application/rtf': '.rtf',
  'application/x-sh': '.sh',
  'image/svg+xml': '.svg',
  'application/x-tar': '.tar',
  'image/tiff': '.tif, .tiff',
  'video/mp2t': '.ts',
  'font/ttf': '.ttf',
  'text/plain': '.txt',
  'application/vnd.visio': '.vsd',
  'audio/wav': '.wav',
  'audio/webm': '.weba',
  'video/webm': '.webm',
  'image/webp': '.webp',
  'font/woff': '.woff',
  'font/woff2': '.woff2',
  'application/xhtml+xml': '.xhtml',
  'application/vnd.mozilla.xul+xml': '.xul',
  'application/zip': '.zip',
  'video/3gpp; audio/3gpp': '.3gp',
  'video/3gpp2; audio/3gpp2': '.3g2',
  'application/x-7z-compressed': '.7z'
};