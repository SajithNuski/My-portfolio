import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve(process.cwd(), 'public', 'favicon.svg');
const outDir = path.resolve(process.cwd(), 'public');

async function generate() {
  if (!fs.existsSync(svgPath)) {
    console.error('favicon.svg not found in public/. Place the SVG there first.');
    process.exit(1);
  }

  const svg = fs.readFileSync(svgPath);

  const sizes = [16, 32, 48, 64, 96];
  try {
    await Promise.all(sizes.map(size => {
      const out = path.join(outDir, `favicon-${size}.png`);
      return sharp(svg)
        .resize(size, size, { fit: 'cover' })
        .png({ quality: 90 })
        .toFile(out);
    }));

    // apple touch icon
    await sharp(svg).resize(180, 180).png({ quality: 90 }).toFile(path.join(outDir, 'apple-touch-icon.png'));

    console.log('Generated favicon PNGs and apple-touch-icon.png in public/');
  } catch (err) {
    console.error('Error generating favicons:', err);
    process.exit(2);
  }
}

generate();
