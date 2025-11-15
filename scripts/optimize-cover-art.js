#!/usr/bin/env node

/**
 * Image Optimization Script for Cover Art
 *
 * Generates optimized versions of CoverArt.png for web use:
 * - Creates WebP versions (better compression)
 * - Creates multiple sizes (512px, 768px, 1024px)
 * - Maintains PNG fallbacks for older browsers
 *
 * Usage: node scripts/optimize-cover-art.js
 */

import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_IMAGE = join(__dirname, '..', 'public', 'CoverArt.png');
const OUTPUT_DIR = join(__dirname, '..', 'public', 'images');

const SIZES = [
  { width: 512, suffix: '512' },
  { width: 768, suffix: '768' },
  { width: 1024, suffix: '1024' },
];

const FORMATS = [
  { ext: 'webp', quality: 85 },
  { ext: 'png', quality: 90 },
];

async function optimizeImage() {
  console.log('🎨 Starting Cover Art Optimization...\n');

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('✅ Created output directory:', OUTPUT_DIR);
  }

  // Check if input file exists
  if (!existsSync(INPUT_IMAGE)) {
    console.error('❌ Error: CoverArt.png not found at:', INPUT_IMAGE);
    process.exit(1);
  }

  // Get original image metadata
  const metadata = await sharp(INPUT_IMAGE).metadata();
  console.log(`📐 Original image: ${metadata.width}x${metadata.height}, ${(metadata.size / 1024 / 1024).toFixed(2)}MB\n`);

  let totalSaved = 0;
  const originalSize = metadata.size;

  // Generate optimized versions
  for (const size of SIZES) {
    for (const format of FORMATS) {
      const outputPath = join(OUTPUT_DIR, `cover-art-${size.suffix}.${format.ext}`);

      try {
        let pipeline = sharp(INPUT_IMAGE).resize(size.width, size.width, {
          fit: 'inside',
          withoutEnlargement: true,
        });

        if (format.ext === 'webp') {
          pipeline = pipeline.webp({ quality: format.quality });
        } else if (format.ext === 'png') {
          pipeline = pipeline.png({
            quality: format.quality,
            compressionLevel: 9,
          });
        }

        await pipeline.toFile(outputPath);

        const stats = await sharp(outputPath).metadata();
        const fileSizeKB = (stats.size / 1024).toFixed(1);
        const compressionRatio = ((1 - stats.size / originalSize) * 100).toFixed(1);

        console.log(`✅ ${size.suffix}px ${format.ext.toUpperCase()}: ${fileSizeKB}KB (${compressionRatio}% smaller)`);
        totalSaved += (originalSize - stats.size);

      } catch (error) {
        console.error(`❌ Error generating ${size.suffix}px ${format.ext}:`, error.message);
      }
    }
  }

  console.log(`\n🎉 Optimization complete!`);
  console.log(`💾 Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)}MB`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`\n💡 Tip: Use WebP versions with PNG fallbacks for best compatibility`);
}

optimizeImage().catch((error) => {
  console.error('❌ Optimization failed:', error);
  process.exit(1);
});
