/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs/promises');
const path = require('path');


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


/**
 * CLEAN AND MOVE BUILD FOLDER
 */
async function cleanAndMoveBuildFolder() {
  const buildPath = path.join(__dirname, 'build');
  const clientPath = path.join(buildPath, 'client');
  const prerenderedPath = path.join(buildPath, 'prerendered');

  // Remove all files (but not folders) in the /build directory
  const filesInBuild = await fs.readdir(buildPath);
  for (const file of filesInBuild) {
    const filePath = path.join(buildPath, file);
    const stat = await fs.lstat(filePath);

    if (stat.isFile()) {
      await fs.unlink(filePath);
    }
  }

  // Move the contents of /build/client to /build
  await moveContents(clientPath, buildPath);

  // Move the contents of /build/prerendered to /build
  await moveContents(prerenderedPath, buildPath);

  // Remove folders /build/server, /build/client, and /build/prerendered
  await fs.rmdir(path.join(buildPath, 'server'), { recursive: true });
  await fs.rmdir(clientPath, { recursive: true });
  await fs.rmdir(prerenderedPath, { recursive: true });

  console.log('Cleanup and move complete.');
}


/**
 * UTILS
 */

async function moveContents(sourceDir, targetDir) {
  const files = await fs.readdir(sourceDir);

  for (const file of files) {
    const sourceFilePath = path.join(sourceDir, file);
    const targetFilePath = path.join(targetDir, file);

    await fs.rename(sourceFilePath, targetFilePath);
  }
}


async function processHtmlFiles(directoryPath, func) {
  const filesInDirectory = await fs.readdir(directoryPath);

  // Iterate through the files and subdirectories
  for (const file of filesInDirectory) {
    const filePath = path.join(directoryPath, file);

    // Check if the item is a file
    const isFile = (await fs.stat(filePath)).isFile();

    if (isFile) {
      // Check if the file is an HTML file
      if (file.endsWith('.html')) {
        // Read the HTML content from the file
        const htmlContent = await fs.readFile(filePath, 'utf8');

        // Fix the HTML content using the fixMyHtml function
        const fixedHtmlContent = await func(htmlContent);

        // Write the fixed HTML content back to the file
        await fs.writeFile(filePath, fixedHtmlContent, 'utf8');

        console.log(`Processed: ${filePath}`);
      }
    } else {
      // If it's a directory, recursively call the function
      await processHtmlFiles(filePath);
    }
  }
}


/**
 * Remove Links and Scripts
 */


function addPeriodAndHTML(htmlString) {
  // Match and replace href attributes that start with "/"
  htmlString = htmlString.replace(/href=["'](\/[^"']+)["']/g, 'href=".$1.html"');

  // Match and replace src attributes that start with "/"
  htmlString = htmlString.replace(/src=["'](\/[^"']+)["']/g, 'src=".$1"');

  // Special case: replace href="/" with "./index.html"
  htmlString = htmlString.replace(/href=["']\/["']/g, 'href="./index.html"');

  return htmlString;
}


function removeJsAndModulePreloadTags(htmlString) {
  // Regular expression to match script tags and link tags with rel="modulepreload"
  const regex = /<script\b[^>]*>(.*?)<\/script>|<link[^>]*rel="modulepreload"[^>]*>/g;

  // Remove script tags and link tags with rel="modulepreload" from the HTML string
  const cleanedHTML = htmlString.replace(regex, '');

  return cleanedHTML;
}


// Define the function to fix HTML content
function fixLinksAndScripts (html) {
  return addPeriodAndHTML(removeJsAndModulePreloadTags(html));
}


async function startFixLinksAndScripts() {
  const buildPath = path.join(__dirname, 'build');
  await processHtmlFiles(buildPath, fixLinksAndScripts);
  console.log('HTML files processing complete.');
}



/**
 * CLEAN AND MOVE NOTION ASSETS
 */

async function moveAndCleanupNotionAssets() {
  const imgDir = path.join(__dirname, 'build', 'notionAssets', 'assets');
  const imgTempDir = path.join(__dirname, 'build', 'notionAssets', 'assets-temp');

  // Rename the existing "img" directory to "img-temp"
  await fs.rename(imgDir, imgTempDir);

  // Create a new "img" directory
  await fs.mkdir(imgDir, { recursive: true });

  await recMoveAndCleanupNotionAssets(imgTempDir);

  console.log('Notion Asset cleanup and move complete.');
}


async function recMoveAndCleanupNotionAssets(directory) {
  const contents = await fs.readdir(directory);

  for (const item of contents) {
    const itemPath = path.join(directory, item);
    const stat = await fs.lstat(itemPath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      await recMoveAndCleanupNotionAssets(itemPath);
    } else if (stat.isFile()) {
      // Process files
      const subdirName = path.basename(directory);
      const newDirName = `${subdirName}`;
      const newDirPath = path.join(__dirname, 'build', 'notionAssets', 'assets', newDirName);

      // Create the new directory if it doesn't exist
      await fs.mkdir(newDirPath, { recursive: true });

      // Move the file to the new directory
      const newFilePath = path.join(newDirPath, item);
      await fs.rename(itemPath, newFilePath);
    }
  }

  // Remove the original directory after processing its contents
  await fs.rmdir(directory, { recursive: true });
}


function renameNotionImgSrc(htmlString) {
  // Regular expression to match img tags with src starting with a period
  const regex = /<(?:img|video)\s+[^>]*src=["'](\.\/notionAssets[^"']*)["'][^>]*>/gi;

  // Find and replace img tags with the updated src attribute
  const updatedHTML = htmlString.replace(regex, (match, src) => {
    const idAndFilename = src.replace('./', ''); // Remove the leading "./"
    const parts = idAndFilename.split('/');
    const id = parts[parts.length - 2];
    const filename = parts[parts.length - 1];
    const newPath = `./notionAssets/assets/${id}/${filename}`;
    return match.replace(src, newPath);
  });

  return updatedHTML;
}


async function startFixNotionAssets() {
  const buildPath = path.join(__dirname, 'build');
  await moveAndCleanupNotionAssets();
  await processHtmlFiles(buildPath, renameNotionImgSrc);
  console.log('Notion Assets processing complete.');
}


/**
 * RENAME SRC AND ASSETS
 */

async function renameAsset (oldName, newName) {
  const oldPath = path.join(__dirname, 'build', 'assets', oldName);
  const newPath = path.join(__dirname, 'build', 'assets', newName);

  // Rename the existing "img" directory to "img-temp"
  await fs.rename(oldPath, newPath);
}


const asyncStringReplace = async (str, regex, aReplacer) => {
  const substrs = [];
  let match;
  let i = 0;
  while ((match = regex.exec(str)) !== null) {
      // put non matching string
      substrs.push(str.slice(i, match.index));
      // call the async replacer function with the matched array spreaded
      substrs.push(aReplacer(...match));
      i = regex.lastIndex;
  }
  // put the rest of str
  substrs.push(str.slice(i));
  // wait for aReplacer calls to finish and join them back into string
  return (await Promise.all(substrs)).join('');
};


async function fetchAssetDataAndRename (match) {
  const src = match.replace(/<img\s+[^>]*src=["'](\.\/assets[^"']*)["'][^>]*>/gi, '$1');
  const parts = src.split('/');
  const url = parts[parts.length - 1];

  const res = await fetch(decodeURIComponent(url));
  const contType = await res.headers.get('content-type');
  const newName = await Date.now() + mimeTypes[contType];
  await renameAsset(url, newName);
  console.log('renamed asset: ' + url + ' -> ' + newName);

  const newPath = `./assets/${newName}`;

  return match.replace(src, newPath)
}


async function fixAssetSrcAndMove (htmlString) {
  // Regular expression to match img tags with src starting with a period
  const regex = /<img\s+[^>]*src=["'](\.\/assets[^"']*)["'][^>]*>/gi;

  // async replace
  const updatedHTML = await asyncStringReplace(htmlString, regex, fetchAssetDataAndRename);

  return updatedHTML;
}


async function startFixAssets() {
  const buildPath = path.join(__dirname, 'build');
  await processHtmlFiles(buildPath, fixAssetSrcAndMove);
  console.log('External Assets processing complete.');
}


/**
 * EXECUTE THE FUNCTIONS
 */

// Call the functions to execute it
await cleanAndMoveBuildFolder()

await startFixLinksAndScripts()

await startFixNotionAssets()

await startFixAssets()
