import fs from 'fs';
import path from 'path';

const ICONS_DIR = path.resolve('icons');
const OUTPUT_FILE = path.resolve('src/names.js');

const files = fs.readdirSync(ICONS_DIR);
const iconNames = files
  .filter(f => f.endsWith('.svg'))
  .map(f => path.basename(f, '.svg'))
  .sort();

const output = `export const names = ${JSON.stringify(iconNames, null, 2)};\n`;

fs.writeFileSync(OUTPUT_FILE, output);
console.log(`✔️  Generated icon list with ${iconNames.length} icons.`);