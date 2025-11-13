#!/usr/bin/env node

/**
 * Generate PWA icons from SVG favicon
 * Usage: node scripts/generate-icons.js
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICON_SIZES = [192, 512];
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');
const FAVICON_SVG = path.join(PUBLIC_DIR, 'favicon.svg');

// Ensure icons directory exists
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
  console.log(`Created directory: ${ICONS_DIR}`);
}

// Read the SVG file
const svgBuffer = fs.readFileSync(FAVICON_SVG);

// Generate standard icons
async function generateStandardIcons() {
  for (const size of ICON_SIZES) {
    const outputPath = path.join(ICONS_DIR, `icon-${size}.png`);
    try {
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 11, g: 11, b: 12, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✓ Generated ${size}x${size} icon: ${outputPath}`);
    } catch (error) {
      console.error(`✗ Error generating ${size}x${size} icon:`, error.message);
      process.exit(1);
    }
  }
}

// Generate maskable icon (with safe zone padding for PWA)
async function generateMaskableIcon() {
  const size = 512;
  // Safe zone is 80% of the icon size (20% padding on all sides)
  const safeZoneSize = Math.floor(size * 0.8);
  const padding = (size - safeZoneSize) / 2;

  const outputPath = path.join(ICONS_DIR, 'icon-maskable.png');

  try {
    // Create a larger SVG with padding for maskable safe zone
    const svgWithPadding = svgBuffer
      .toString()
      .replace('<svg', `<svg style="padding: ${padding}px"`);

    await sharp(Buffer.from(svgWithPadding))
      .resize(size, size, {
        fit: 'contain',
        background: { r: 11, g: 11, b: 12, alpha: 1 }
      })
      .png()
      .toFile(outputPath);

    console.log(`✓ Generated maskable icon (512x512): ${outputPath}`);
  } catch (error) {
    console.error('✗ Error generating maskable icon:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  try {
    console.log('Generating PWA icons from favicon.svg...\n');

    await generateStandardIcons();
    await generateMaskableIcon();

    console.log('\n✓ All icons generated successfully!');
    console.log('\nGenerated files:');
    console.log('  - public/icons/icon-192.png');
    console.log('  - public/icons/icon-512.png');
    console.log('  - public/icons/icon-maskable.png');
    console.log('  - public/favicon.svg');
  } catch (error) {
    console.error('✗ Fatal error:', error);
    process.exit(1);
  }
}

main();
