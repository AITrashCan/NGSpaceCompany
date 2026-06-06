import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const W = 1920, H = 1080;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Base: dark deep sky with subtle purple
const base = ctx.createLinearGradient(0, 0, W, H);
base.addColorStop(0, '#060612');
base.addColorStop(0.3, '#0d0a1f');
base.addColorStop(0.6, '#0a0e1a');
base.addColorStop(1, '#10081e');
ctx.fillStyle = base;
ctx.fillRect(0, 0, W, H);

// Seeded random for reproducibility
let seed = 42;
function rand() {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
}

// Draw nebula-like spirit qi clouds
function drawCloud(cx, cy, rx, ry, color, alpha, layers) {
    for (let i = 0; i < layers; i++) {
        const ox = (rand() - 0.5) * rx * 0.5;
        const oy = (rand() - 0.5) * ry * 0.3;
        const r = rx * (0.4 + rand() * 0.6);
        const grad = ctx.createRadialGradient(cx + ox, cy + oy, 0, cx + ox, cy + oy, r);
        grad.addColorStop(0, color.replace('ALPHA', String(alpha * (0.3 + rand() * 0.3))));
        grad.addColorStop(0.5, color.replace('ALPHA', String(alpha * 0.1)));
        grad.addColorStop(1, color.replace('ALPHA', '0'));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(cx + ox, cy + oy, r, r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Purple spirit qi clouds (upper left)
drawCloud(W * 0.2, H * 0.15, 400, 200, 'rgba(80,30,120,ALPHA)', 0.4, 15);
drawCloud(W * 0.35, H * 0.25, 350, 150, 'rgba(60,20,100,ALPHA)', 0.3, 12);

// Cyan spirit qi wisps (center)
drawCloud(W * 0.55, H * 0.4, 300, 120, 'rgba(20,80,120,ALPHA)', 0.25, 10);
drawCloud(W * 0.7, H * 0.3, 250, 100, 'rgba(30,60,100,ALPHA)', 0.2, 8);

// Golden spirit light (subtle, right side)
drawCloud(W * 0.85, H * 0.6, 200, 80, 'rgba(120,80,20,ALPHA)', 0.15, 6);

// Bottom: faint mountain silhouettes (仙山)
ctx.save();
ctx.globalAlpha = 0.15;
ctx.fillStyle = '#0a0815';
ctx.beginPath();
ctx.moveTo(0, H);
ctx.lineTo(0, H * 0.75);
ctx.lineTo(W * 0.05, H * 0.68);
ctx.lineTo(W * 0.12, H * 0.72);
ctx.lineTo(W * 0.18, H * 0.55);
ctx.lineTo(W * 0.25, H * 0.62);
ctx.lineTo(W * 0.32, H * 0.48);
ctx.lineTo(W * 0.38, H * 0.52);
ctx.lineTo(W * 0.45, H * 0.6);
ctx.lineTo(W * 0.52, H * 0.65);
ctx.lineTo(W * 0.58, H * 0.58);
ctx.lineTo(W * 0.65, H * 0.62);
ctx.lineTo(W * 0.72, H * 0.5);
ctx.lineTo(W * 0.78, H * 0.55);
ctx.lineTo(W * 0.85, H * 0.63);
ctx.lineTo(W * 0.92, H * 0.56);
ctx.lineTo(W, H * 0.7);
ctx.lineTo(W, H);
ctx.closePath();
ctx.fill();

// Closer mountains
ctx.globalAlpha = 0.1;
ctx.fillStyle = '#080612';
ctx.beginPath();
ctx.moveTo(0, H);
ctx.lineTo(0, H * 0.82);
ctx.lineTo(W * 0.08, H * 0.76);
ctx.lineTo(W * 0.15, H * 0.8);
ctx.lineTo(W * 0.22, H * 0.7);
ctx.lineTo(W * 0.3, H * 0.75);
ctx.lineTo(W * 0.4, H * 0.68);
ctx.lineTo(W * 0.48, H * 0.73);
ctx.lineTo(W * 0.55, H * 0.78);
ctx.lineTo(W * 0.62, H * 0.72);
ctx.lineTo(W * 0.7, H * 0.76);
ctx.lineTo(W * 0.78, H * 0.66);
ctx.lineTo(W * 0.86, H * 0.74);
ctx.lineTo(W * 0.93, H * 0.68);
ctx.lineTo(W, H * 0.76);
ctx.lineTo(W, H);
ctx.closePath();
ctx.fill();
ctx.restore();

// Stars (scattered faint dots)
for (let i = 0; i < 300; i++) {
    const x = rand() * W;
    const y = rand() * H * 0.7;
    const r = rand() * 1.2 + 0.3;
    const a = rand() * 0.6 + 0.1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,200,255,${a})`;
    ctx.fill();
}

// A few brighter "spirit stars"
for (let i = 0; i < 8; i++) {
    const x = rand() * W;
    const y = rand() * H * 0.5;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 8);
    grad.addColorStop(0, 'rgba(220,220,255,0.6)');
    grad.addColorStop(0.3, 'rgba(180,180,255,0.2)');
    grad.addColorStop(1, 'rgba(180,180,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x - 8, y - 8, 16, 16);
}

const outPath = path.join(__dirname, '../src/assets/bk.jpg');
const buf = canvas.toBuffer('image/jpeg', { quality: 0.92 });
fs.writeFileSync(outPath, buf);
console.log('Background generated: ' + outPath + ' (' + buf.length + ' bytes)');
