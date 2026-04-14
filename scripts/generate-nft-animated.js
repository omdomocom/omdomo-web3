#!/usr/bin/env node
/**
 * NFT Animated GIF Generator
 * Toma los PNGs generados y añade: glow pulsante, estrellas parpadeantes,
 * partículas y borde rotante. Output: public/nft-assets/{id}.gif (600×600)
 */
require('dotenv').config({ path: '.env.local' });
const GIFEncoder = require('gif-encoder-2');
const { createCanvas, loadImage } = require('canvas');
const fs   = require('fs');
const path = require('path');

const OUT_DIR  = path.join(__dirname, '../public/nft-assets');
const W = 600, H = 600;
const FRAMES   = 30;   // 30 frames × 67ms ≈ 2 segundos
const DELAY_MS = 67;

function hexToRgb(h) {
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}

const NFTs = [
  { id:0,  color:'#fbbf24', c2:'#a78bfa' },
  { id:1,  color:'#22d3ee', c2:'#c026d3' },
  { id:2,  color:'#fbbf24', c2:'#2dd4bf' },
  { id:3,  color:'#fbbf24', c2:'#06b6d4' },
  { id:4,  color:'#38bdf8', c2:'#8b5cf6' },
  { id:5,  color:'#f97316', c2:'#fbbf24' },
  { id:6,  color:'#818cf8', c2:'#38bdf8' },
  { id:7,  color:'#34d399', c2:'#22d3ee' },
  { id:8,  color:'#e879f9', c2:'#8b5cf6' },
  { id:9,  color:'#f59e0b', c2:'#f97316' },
  { id:10, color:'#2dd4bf', c2:'#818cf8' },
  { id:11, color:'#60a5fa', c2:'#a78bfa' },
  { id:12, color:'#c084fc', c2:'#2dd4bf' },
];

// Genera partículas fijas por NFT (seed determinista)
function makeParticles(id, n = 18) {
  const rng = (s) => { let x = Math.sin(s)*10000; return x - Math.floor(x); };
  return Array.from({ length: n }, (_, i) => ({
    x: rng(id * 100 + i * 7) * W,
    y: rng(id * 100 + i * 7 + 1) * H,
    r: 1.2 + rng(id * 100 + i * 7 + 2) * 2.8,
    phase: rng(id * 100 + i * 7 + 3) * Math.PI * 2,
    speed: 0.8 + rng(id * 100 + i * 7 + 4) * 1.2,
  }));
}

async function generateGIF(nft) {
  const srcPath = path.join(OUT_DIR, `${nft.id}.png`);
  if (!fs.existsSync(srcPath)) {
    console.log(`  ⚠️  ${nft.id}.png no existe, saltando`);
    return;
  }

  const [cr, cg, cb]  = hexToRgb(nft.color);
  const [cr2,cg2,cb2] = hexToRgb(nft.c2);
  const particles = makeParticles(nft.id);

  const srcImg = await loadImage(srcPath);

  const outPath = path.join(OUT_DIR, `${nft.id}.gif`);
  const encoder = new GIFEncoder(W, H, 'neuquant', true, FRAMES);
  const outStream = fs.createWriteStream(outPath);
  encoder.createReadStream().pipe(outStream);
  encoder.setDelay(DELAY_MS);
  encoder.setQuality(12);
  encoder.setRepeat(0);
  encoder.start();

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < FRAMES; f++) {
    const t = f / FRAMES;                          // 0 → 1
    const pulse  = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);       // 0→1→0 suave
    const pulse2 = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 + 1);   // desfasado
    const angle  = t * Math.PI * 2;                               // rotación borde

    ctx.clearRect(0, 0, W, H);

    // ── 1. Imagen base escalada
    ctx.drawImage(srcImg, 0, 0, W, H);

    // ── 2. Vignette animada (respira)
    const vig = ctx.createRadialGradient(W/2, H/2, H * 0.25, W/2, H/2, H * 0.72);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, `rgba(8,0,22,${0.30 + 0.18 * pulse})`);
    ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

    // ── 3. Partículas parpadeantes
    particles.forEach(p => {
      const alpha = 0.15 + 0.75 * (0.5 + 0.5 * Math.sin(angle * p.speed + p.phase));
      const grd = ctx.createRadialGradient(p.x * W/W, p.y * H/H, 0, p.x * W/W, p.y * H/H, p.r * 4);
      grd.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
      // Núcleo brillante
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2); ctx.fill();
    });

    // ── 4. Borde rotante con gradiente cónico simulado
    ctx.save();
    ctx.translate(W/2, H/2);
    ctx.rotate(angle * 0.25);
    ctx.translate(-W/2, -H/2);
    const borderGrd = ctx.createLinearGradient(0, 0, W, H);
    borderGrd.addColorStop(0,   `rgba(${cr},${cg},${cb},${0.55 + 0.35*pulse})`);
    borderGrd.addColorStop(0.33,`rgba(${cr2},${cg2},${cb2},${0.30 + 0.20*pulse2})`);
    borderGrd.addColorStop(0.66,`rgba(${cr},${cg},${cb},${0.55 + 0.35*pulse})`);
    borderGrd.addColorStop(1,   `rgba(${cr2},${cg2},${cb2},${0.30 + 0.20*pulse2})`);
    ctx.strokeStyle = borderGrd;
    ctx.lineWidth = 3;
    ctx.shadowColor = `rgba(${cr},${cg},${cb},${0.7 + 0.3*pulse})`;
    ctx.shadowBlur = 12 + 10 * pulse;
    ctx.strokeRect(5, 5, W-10, H-10);
    ctx.restore();
    ctx.shadowBlur = 0;

    // ── 5. Esquinas decorativas pulsantes
    const cAlpha = 0.70 + 0.30 * pulse;
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},${cAlpha})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = `rgba(${cr},${cg},${cb},1)`; ctx.shadowBlur = 8 + 6 * pulse;
    [[14,14],[W-14,14],[14,H-14],[W-14,H-14]].forEach(([px,py], i) => {
      const dx = i%2===0 ? 22 : -22, dy = i<2 ? 22 : -22;
      ctx.beginPath(); ctx.moveTo(px, py+dy); ctx.lineTo(px, py); ctx.lineTo(px+dx, py); ctx.stroke();
    });
    ctx.shadowBlur = 0;

    // ── 6. Glow en esquina inferior derecha (donde está el símbolo)
    const sx = W - 52, sy = H - 52;
    const symGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 52);
    symGlow.addColorStop(0, `rgba(${cr},${cg},${cb},${0.20 + 0.25 * pulse})`);
    symGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = symGlow;
    ctx.beginPath(); ctx.arc(sx, sy, 52, 0, Math.PI*2); ctx.fill();

    encoder.addFrame(ctx);
  }

  encoder.finish();
  await new Promise(r => outStream.on('finish', r));
  const size = (fs.statSync(outPath).size / 1024).toFixed(0);
  console.log(`  ✅ ${nft.id}.gif — ${size} KB`);
}

async function main() {
  const testId = process.argv[2] !== undefined ? parseInt(process.argv[2]) : null;
  const list   = testId !== null ? [NFTs[testId]] : NFTs;

  console.log(`\n✨ Generando ${list.length} GIF(s) animados...\n`);
  for (const nft of list) {
    process.stdout.write(`[${nft.id}/12] `);
    await generateGIF(nft);
  }
  console.log('\n✅ GIFs listos en public/nft-assets/');
}

main().catch(console.error);
