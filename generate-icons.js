const fs = require('fs');
const path = require('path');

// Simple SVG icons that can be converted to PNG
// For production, use a tool like sharp or canvas to generate actual PNG files

const icon192SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#2563eb"/>
  <circle cx="96" cy="96" r="67" fill="#ffffff"/>
  <path d="M 76 96 L 88 108 L 116 80" stroke="#2563eb" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const icon512SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#2563eb"/>
  <circle cx="256" cy="256" r="179" fill="#ffffff"/>
  <path d="M 203 256 L 235 288 L 309 214" stroke="#2563eb" stroke-width="32" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'public', 'icon-192.svg'), icon192SVG);
fs.writeFileSync(path.join(__dirname, 'public', 'icon-512.svg'), icon512SVG);

console.log('SVG icons generated!');
console.log('Convert to PNG using:');
console.log('  - Online: https://cloudconvert.com/svg-to-png');
console.log('  - Or use ImageMagick: convert icon-192.svg icon-192.png');
console.log('  - Or use the create-icons.html file in a browser');
