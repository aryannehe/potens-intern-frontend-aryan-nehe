import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base64 for a solid brand-blue (#0f172a) square PNG
const blueSquareBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABl/iY1AAAAA1BMVEUPFypV/8dYAAAAFUlEQVR42u3BAQEAAACAkP6v7ggKAAAAAPwGBlgAAQHf50IAAAAAElFTkSuQmCC';

// Base64 for a standard 16x16 blue favicon
const faviconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const assets = [
  { name: 'pwa-192x192.png', base64: blueSquareBase64 },
  { name: 'pwa-512x512.png', base64: blueSquareBase64 },
  { name: 'apple-touch-icon.png', base64: blueSquareBase64 },
  { name: 'favicon.ico', base64: faviconBase64 }
];

const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

assets.forEach(asset => {
  const filePath = path.join(publicDir, asset.name);
  const buffer = Buffer.from(asset.base64, 'base64');
  fs.writeFileSync(filePath, buffer);
  console.log(`Created PWA asset: ${asset.name}`);
});

// Also create masked-icon.svg
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" stroke="#0f172a" stroke-width="32">
  <path d="M256 48L80 114v166c0 136 176 220 176 220s176-84 176-220V114L256 48z" fill="#0f172a"/>
  <path d="M256 160v192M160 256h192" stroke="#ffffff" stroke-width="40"/>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'masked-icon.svg'), svgContent);
console.log('Created PWA asset: masked-icon.svg');
