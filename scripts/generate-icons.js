import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const sizes = [16, 48, 128];
const iconTypes = ['', '-active'];

async function generateIcons() {
  for (const size of sizes) {
    for (const type of iconTypes) {
      const inputPath = path.join('public', 'icons', `icon${type}.svg`);
      const outputPath = path.join('public', 'icons', `icon${size}${type}.png`);
      
      await sharp(inputPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated ${outputPath}`);
    }
  }
}

generateIcons().catch(console.error); 