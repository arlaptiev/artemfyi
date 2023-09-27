/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs/promises');
const path = require('path');


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
 * CLEAN AND MOVE IMAGES
 */

async function moveAndCleanupAssets() {
  const imgDir = path.join(__dirname, 'build', 'assets', 'img');
  const imgTempDir = path.join(__dirname, 'build', 'assets', 'img-temp');

  // Rename the existing "img" directory to "img-temp"
  await fs.rename(imgDir, imgTempDir);

  // Create a new "img" directory
  await fs.mkdir(imgDir, { recursive: true });

  await recMoveAndCleanupAssets(imgTempDir);

  console.log('Asset cleanup and move complete.');
}

async function recMoveAndCleanupAssets(directory) {
  const contents = await fs.readdir(directory);

  for (const item of contents) {
    const itemPath = path.join(directory, item);
    const stat = await fs.lstat(itemPath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      await recMoveAndCleanupAssets(itemPath);
    } else if (stat.isFile()) {
      // Process files
      const subdirName = path.basename(directory);
      const newDirName = `${subdirName}-${Date.now()}`;
      const newDirPath = path.join(__dirname, 'build', 'assets', 'img', newDirName);

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


/**
 * PROCESS HTML FILES
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

function renameImgSrc(htmlString) {
  // Regular expression to match img tags with src starting with a period
  const regex = /<img\b[^>]*src="(\.\/[^"]+)"[^>]*>/g;

  // Find and replace img tags with the updated src attribute
  const updatedHTML = htmlString.replace(regex, (match, src) => {
    const idAndFilename = src.replace('./', ''); // Remove the leading "./"
    const parts = idAndFilename.split('/');
    const id = parts[2];
    const filename = parts[parts.length - 1];
    const newPath = `./assets/img/${id}/${filename}`;
    return match.replace(src, newPath);
  });

  return updatedHTML;
}


// Define the function to fix HTML content
function fixMyHtml(html) {
  return renameImgSrc(
    addPeriodAndHTML(
      removeJsAndModulePreloadTags(html)
      )
    );
}


async function processHtmlFiles(directoryPath) {
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
        const fixedHtmlContent = fixMyHtml(htmlContent);

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

async function startProcessingHTMLFiles() {
  const buildPath = path.join(__dirname, 'build');
  await processHtmlFiles(buildPath);
  console.log('HTML files processing complete.');
}


/**
 * EXECUTE THE FUNCTIONS
 */

// Call the functions to execute it
await cleanAndMoveBuildFolder().catch(err => {
  console.error('Error:', err);
});

await moveAndCleanupAssets().catch(err => {
  console.error('Error:', err);
});

await startProcessingHTMLFiles().catch(err => {
  console.error('Error:', err);
});
