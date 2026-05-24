#!/usr/bin/env node
/**
 * Post-build cache busting script.
 * Renames assets in dist/ with content hashes and updates all references.
 * Run after `npm run build`.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');
const ASSET_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.mp4', '.webm', '.pdf'];

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

function getAllFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (ASSET_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  console.log('🔨 Cache busting assets...');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found. Run npm run build first.');
    process.exit(1);
  }

  // 1. Find all asset files in dist/
  const assetFiles = getAllFiles(DIST_DIR);
  if (assetFiles.length === 0) {
    console.log('No assets found.');
    return;
  }

  // 2. Build rename map: original filename -> hashed filename
  const renameMap = {}; // basename -> hashedBasename

  for (const filePath of assetFiles) {
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    
    // Skip if already hashed
    if (/\.[a-f0-9]{8}$/.test(base)) {
      continue;
    }

    const hash = hashFile(filePath);
    const newName = `${base}.${hash}${ext}`;
    const newPath = path.join(path.dirname(filePath), newName);

    fs.renameSync(filePath, newPath);
    renameMap[path.basename(filePath)] = newName;
    console.log(`  ${path.basename(filePath)} → ${newName}`);
  }

  if (Object.keys(renameMap).length === 0) {
    console.log('No files needed hashing.');
    return;
  }

  // 3. Replace references in all JS, HTML, CSS files
  const codeFiles = [];
  function collectCodeFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collectCodeFiles(fullPath);
      } else if (/\.(js|html|css)$/.test(entry.name)) {
        codeFiles.push(fullPath);
      }
    }
  }
  collectCodeFiles(DIST_DIR);

  let totalReplacements = 0;
  for (const codeFile of codeFiles) {
    let content = fs.readFileSync(codeFile, 'utf-8');
    let changed = false;

    for (const [original, hashed] of Object.entries(renameMap)) {
      // Escape special regex characters in filename
      const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match the filename as a complete path component
      const regex = new RegExp(`(${escaped})([^a-f0-9]|$)`, 'g');
      
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, hashed + '$2');
        changed = true;
        totalReplacements += matches.length;
      }
    }

    if (changed) {
      fs.writeFileSync(codeFile, content, 'utf-8');
    }
  }

  console.log(`✅ ${Object.keys(renameMap).length} assets hashed, ${totalReplacements} references updated.`);
}

main();
