import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Generate an SVG background, then convert to PNG via Vite's built-in handling
// Actually we'll use SVG directly in CSS since Vite can serve it

// Create an SVG with cultivation theme: dark sky, spirit qi clouds, mountains, stars
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="cloud1" cx="20%" cy="15%" r="45%">
      <stop offset="0%" stop-color="rgba(80,30,120,0.35)"/>
      <stop offset="50%" stop-color="rgba(60,20,100,0.12)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <radialGradient id="cloud2" cx="35%" cy="25%" r="40%">
      <stop offset="0%" stop-color="rgba(60,20,100,0.25)"/>
      <stop offset="50%" stop-color="rgba(40,10,80,0.08)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <radialGradient id="cloud3" cx="55%" cy="40%" r="35%">
      <stop offset="0%" stop-color="rgba(20,80,120,0.2)"/>
      <stop offset="50%" stop-color="rgba(10,40,80,0.06)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <radialGradient id="cloud4" cx="70%" cy="30%" r="30%">
      <stop offset="0%" stop-color="rgba(30,60,100,0.18)"/>
      <stop offset="50%" stop-color="rgba(15,30,60,0.05)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <radialGradient id="cloud5" cx="85%" cy="60%" r="25%">
      <stop offset="0%" stop-color="rgba(120,80,20,0.12)"/>
      <stop offset="50%" stop-color="rgba(60,40,10,0.04)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#060612"/>
      <stop offset="30%" stop-color="#0d0a1f"/>
      <stop offset="60%" stop-color="#0a0e1a"/>
      <stop offset="100%" stop-color="#10081e"/>
    </linearGradient>
  </defs>

  <!-- Base sky -->
  <rect width="1920" height="1080" fill="url(#sky)"/>

  <!-- Spirit qi clouds -->
  <rect width="1920" height="1080" fill="url(#cloud1)"/>
  <rect width="1920" height="1080" fill="url(#cloud2)"/>
  <rect width="1920" height="1080" fill="url(#cloud3)"/>
  <rect width="1920" height="1080" fill="url(#cloud4)"/>
  <rect width="1920" height="1080" fill="url(#cloud5)"/>

  <!-- Stars -->
  <circle cx="120" cy="80" r="1" fill="rgba(200,200,255,0.4)"/>
  <circle cx="350" cy="45" r="0.8" fill="rgba(200,200,255,0.3)"/>
  <circle cx="580" cy="120" r="1.2" fill="rgba(200,200,255,0.5)"/>
  <circle cx="720" cy="60" r="0.7" fill="rgba(200,200,255,0.25)"/>
  <circle cx="900" cy="150" r="1" fill="rgba(200,200,255,0.35)"/>
  <circle cx="1100" cy="80" r="1.5" fill="rgba(200,200,255,0.45)"/>
  <circle cx="1300" cy="200" r="0.9" fill="rgba(200,200,255,0.3)"/>
  <circle cx="1500" cy="110" r="1.1" fill="rgba(200,200,255,0.4)"/>
  <circle cx="1700" cy="50" r="0.8" fill="rgba(200,200,255,0.25)"/>
  <circle cx="200" cy="300" r="1" fill="rgba(200,200,255,0.3)"/>
  <circle cx="480" cy="250" r="1.3" fill="rgba(200,200,255,0.4)"/>
  <circle cx="750" cy="320" r="0.9" fill="rgba(200,200,255,0.35)"/>
  <circle cx="1000" cy="280" r="1" fill="rgba(200,200,255,0.3)"/>
  <circle cx="1250" cy="350" r="1.2" fill="rgba(200,200,255,0.4)"/>
  <circle cx="1600" cy="260" r="0.8" fill="rgba(200,200,255,0.25)"/>
  <circle cx="400" cy="400" r="0.7" fill="rgba(200,200,255,0.2)"/>
  <circle cx="650" cy="380" r="1" fill="rgba(200,200,255,0.3)"/>
  <circle cx="950" cy="420" r="0.8" fill="rgba(200,200,255,0.25)"/>
  <circle cx="1850" cy="180" r="1" fill="rgba(200,200,255,0.35)"/>
  <circle cx="50" cy="200" r="1.2" fill="rgba(200,200,255,0.45)"/>

  <!-- Spirit stars (brighter with glow) -->
  <circle cx="300" cy="100" r="3" fill="rgba(220,220,255,0.5)" />
  <circle cx="300" cy="100" r="8" fill="rgba(180,180,255,0.15)" />
  <circle cx="1200" cy="170" r="3" fill="rgba(220,220,255,0.5)" />
  <circle cx="1200" cy="170" r="8" fill="rgba(180,180,255,0.15)" />
  <circle cx="1800" cy="140" r="2.5" fill="rgba(220,220,255,0.4)" />
  <circle cx="1800" cy="140" r="7" fill="rgba(180,180,255,0.1)" />
  <circle cx="600" cy="280" r="2" fill="rgba(220,220,255,0.35)" />
  <circle cx="600" cy="280" r="6" fill="rgba(180,180,255,0.08)" />

  <!-- Mountain silhouettes (far) -->
  <path d="M0,1080 L0,810 L96,734 L230,778 L345,594 L480,669 L614,518 L730,562 L864,648 L993,697 L1108,626 L1248,669 L1382,540 L1498,594 L1632,677 L1766,605 L1920,756 L1920,1080 Z" fill="#0a0815" opacity="0.15"/>

  <!-- Mountain silhouettes (near) -->
  <path d="M0,1080 L0,886 L154,821 L288,864 L422,756 L576,810 L768,734 L922,789 L1056,842 L1190,779 L1344,821 L1498,713 L1651,797 L1786,734 L1920,821 L1920,1080 Z" fill="#080612" opacity="0.1"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, '../src/assets/bk.svg'), svg);
console.log('SVG background generated');