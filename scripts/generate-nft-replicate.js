#!/usr/bin/env node
/**
 * NFT Generator — Replicate AI + canvas overlay
 * 1. Replicate (Stable Diffusion XL) genera el arte del animal zodiacal
 * 2. node-canvas superpone: constelación + símbolo + branding Om Domo
 * 3. Exporta PNG 1000×1000 listo para Thirdweb
 */
require('dotenv').config({ path: '.env.local' });
const Replicate  = require('replicate');
const puppeteer  = require('puppeteer');
const { createCanvas, loadImage, registerFont } = require('canvas');
registerFont('/System/Library/Fonts/Apple Symbols.ttf', { family: 'AppleSymbols' });
const fs   = require('fs');
const path = require('path');
const https = require('https');
const http  = require('http');

const OUT_DIR = path.join(__dirname, '../public/nft-assets');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// ── NFT data ──────────────────────────────────────────────────────────────────
const NFTs = [
  {
    id:0, nameES:'Génesis', symbol:'✦', color:'#fbbf24', c2:'#a78bfa',
    element:'Especial',
    prompt:'sacred geometry mandala, flower of life, cosmic golden light, purple nebula, mystical spiritual art, ornate fractal patterns, glowing sacred symbols, deep space background, ultra detailed, professional digital art, neon glow'
  },
  {
    id:1, nameES:'Aries', symbol:'♈', color:'#22d3ee', c2:'#c026d3',
    element:'Fuego',
    prompt:'majestic ram with large spiral horns, zodiac aries, cosmic neon art, cyan and purple neon glow, ornate decorative patterns on horns, glowing eyes, dark purple galaxy background, symmetrical front view, professional NFT illustration, ultra detailed fantasy art'
  },
  {
    id:2, nameES:'Tauro', symbol:'♉', color:'#fbbf24', c2:'#2dd4bf',
    element:'Tierra',
    prompt:'powerful bull head zodiac taurus, golden and teal neon glow, ornate mandala patterns on forehead, glowing golden eyes, symmetrical front view, dark purple cosmic background, sacred geometry details, ultra detailed fantasy NFT art, professional digital illustration'
  },
  {
    id:3, nameES:'Géminis', symbol:'♊', color:'#fbbf24', c2:'#06b6d4',
    element:'Aire',
    prompt:'zodiac gemini twin figures, two mirrored cosmic beings, golden and cyan neon, flowing hair made of stardust, holding celestial lyre, ornate decorative robes, dark purple nebula background, symmetrical composition, ultra detailed fantasy art, professional NFT illustration'
  },
  {
    id:4, nameES:'Cáncer', symbol:'♋', color:'#38bdf8', c2:'#8b5cf6',
    element:'Agua',
    prompt:'cosmic crab zodiac cancer, blue and purple neon glow, ornate shell with mandala patterns, large glowing claws, mystical ocean aura, dark purple space background, symmetrical top view, ultra detailed fantasy NFT art, professional digital illustration'
  },
  {
    id:5, nameES:'Leo', symbol:'♌', color:'#f97316', c2:'#fbbf24',
    element:'Fuego',
    prompt:'majestic lion face zodiac leo, radiant golden orange mane like sun rays, ornate crown, glowing amber eyes, intricate mandala patterns in mane, dark purple cosmic background, symmetrical front view, ultra detailed fantasy NFT art, neon glow, professional digital illustration'
  },
  {
    id:6, nameES:'Virgo', symbol:'♍', color:'#818cf8', c2:'#38bdf8',
    element:'Tierra',
    prompt:'zodiac virgo goddess maiden, flowing indigo and blue aurora hair, holding glowing wheat, ornate celestial robes with sacred geometry, serene face, dark purple galaxy background, ultra detailed fantasy art, neon glow, professional NFT illustration'
  },
  {
    id:7, nameES:'Libra', symbol:'♎', color:'#34d399', c2:'#22d3ee',
    element:'Aire',
    prompt:'cosmic balance scales zodiac libra, teal and emerald neon glow, ornate decorative scales with moon on left and sun on right, celestial chains, glowing gems, dark purple space background, symmetrical composition, ultra detailed fantasy NFT art, professional digital illustration'
  },
  {
    id:8, nameES:'Escorpio', symbol:'♏', color:'#e879f9', c2:'#8b5cf6',
    element:'Agua',
    prompt:'majestic fantasy scorpion zodiac scorpio, diagonal pose, large raised pincer claw on upper left reaching upward, second claw on right side, thick segmented body in center, long segmented tail curving downward and to the lower left ending in sharp venomous stinger, eight legs spread naturally, neon magenta and deep purple glowing exoskeleton, intricate ornate mandala sacred geometry armor patterns, glowing gemstones embedded in body, dark purple cosmic nebula background, dramatic fantasy NFT art style, ultra detailed 8K illustration, masterpiece quality'
  },
  {
    id:9, nameES:'Sagitario', symbol:'♐', color:'#f59e0b', c2:'#f97316',
    element:'Fuego',
    prompt:'zodiac sagittarius cosmic archer, glowing golden arrow in flight, ornate decorated bow, amber and orange neon glow, stardust trail, dark purple nebula background, dynamic diagonal composition, ultra detailed fantasy NFT art, professional digital illustration'
  },
  {
    id:10, nameES:'Capricornio', symbol:'♑', color:'#2dd4bf', c2:'#818cf8',
    element:'Tierra',
    prompt:'zodiac capricorn sea goat, teal and indigo neon glow, goat head with ornate twisted horns, iridescent fish tail with scales, sacred geometry patterns, dark purple cosmic ocean background, ultra detailed fantasy NFT art, professional digital illustration'
  },
  {
    id:11, nameES:'Acuario', symbol:'♒', color:'#60a5fa', c2:'#a78bfa',
    element:'Aire',
    prompt:'zodiac aquarius water bearer, cosmic figure pouring glowing blue water, blue and violet neon glow, ornate celestial robes, star-embedded water waves, dark purple galaxy background, ultra detailed fantasy NFT art, professional digital illustration'
  },
  {
    id:12, nameES:'Piscis', symbol:'♓', color:'#c084fc', c2:'#2dd4bf',
    element:'Agua',
    prompt:'zodiac pisces two fish yin yang, purple and teal neon glow, two glowing ornate fish in circular arrangement, flowing fins made of stardust, swirling cosmic water, dark purple nebula background, symmetrical composition, ultra detailed fantasy NFT art, professional digital illustration'
  },
];

// Constelaciones
const CONSTELLATIONS = {
  genesis:    { stars:[[.50,.28],[.72,.38],[.72,.62],[.50,.72],[.28,.62],[.28,.38],[.50,.50]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6]] },
  aries:      { stars:[[.20,.52],[.36,.38],[.52,.40],[.68,.34],[.82,.26]], lines:[[0,1],[1,2],[2,3],[3,4]] },
  tauro:      { stars:[[.18,.68],[.32,.54],[.50,.44],[.68,.54],[.82,.64],[.62,.26],[.76,.16]], lines:[[0,1],[1,2],[2,3],[3,4],[2,5],[5,6]] },
  geminis:    { stars:[[.34,.16],[.64,.16],[.32,.32],[.62,.32],[.30,.50],[.60,.50],[.34,.66],[.64,.64]], lines:[[0,2],[2,4],[4,6],[1,3],[3,5],[5,7],[4,5]] },
  cancer:     { stars:[[.26,.34],[.50,.26],[.74,.34],[.30,.64],[.50,.72],[.70,.64]], lines:[[0,1],[1,2],[0,3],[2,5],[3,4],[4,5]] },
  leo:        { stars:[[.18,.70],[.34,.54],[.48,.42],[.62,.30],[.76,.20],[.74,.46],[.64,.60]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[1,6]] },
  virgo:      { stars:[[.50,.14],[.66,.26],[.76,.42],[.50,.64],[.30,.56],[.22,.40]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]] },
  libra:      { stars:[[.28,.50],[.72,.50],[.50,.26],[.50,.66],[.18,.66],[.82,.66]], lines:[[0,1],[0,2],[1,2],[0,3],[1,3],[0,4],[1,5]] },
  escorpio:   { stars:[[.72,.08],[.56,.05],[.40,.08],[.56,.20],[.60,.33,6],[.62,.46],[.64,.58],[.62,.70],[.54,.80],[.43,.85],[.34,.80],[.28,.70,5],[.24,.60,5]], lines:[[0,1],[1,2],[1,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[10,12]] },
  sagitario:  { stars:[[.46,.18],[.62,.24],[.72,.36],[.66,.50],[.48,.58],[.30,.50],[.22,.36]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]] },
  capricornio:{ stars:[[.12,.42],[.28,.32],[.46,.28],[.64,.32],[.80,.42],[.78,.58],[.62,.70],[.28,.68]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0]] },
  acuario:    { stars:[[.14,.36],[.30,.32],[.50,.38],[.66,.30],[.86,.36],[.20,.60],[.36,.56],[.56,.62],[.74,.56],[.90,.62]], lines:[[0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[8,9]] },
  piscis:     { stars:[[.14,.48],[.24,.34],[.36,.28],[.46,.34],[.42,.52],[.86,.48],[.76,.34],[.62,.28],[.54,.34],[.58,.52]], lines:[[0,1],[1,2],[2,3],[3,4],[4,0],[5,6],[6,7],[7,8],[8,9],[9,5]] },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function hexToRgb(h){ return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; }
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

// Descarga una URL a buffer
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ── Generar imagen AI con Replicate ──────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function generateAIImage(nft, attempt = 1) {
  const fullPrompt = `${nft.prompt}, masterpiece, vibrant neon colors, high contrast, 8K resolution, centered composition, no text, no watermark`;
  const negativePrompt = nft.id === 8
    ? 'text, watermark, signature, blurry, low quality, spider, web, spiderweb, tarantula, no tail, missing claws, missing stinger, cropped, white background'
    : 'text, watermark, signature, blurry, low quality, deformed, ugly, bad anatomy, extra limbs, cropped, white background';

  if (attempt === 1) console.log(`  🤖 Generando arte AI para ${nft.nameES}...`);
  else console.log(`  🔄 Reintento ${attempt} para ${nft.nameES}...`);

  try {
  const useFlux = nft.id === 8;
  const output = await replicate.run(
    useFlux
      ? 'black-forest-labs/flux-schnell'
      : 'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
    useFlux ? {
      input: {
        prompt: fullPrompt,
        num_outputs: 1,
        aspect_ratio: '1:1',
        output_format: 'png',
        num_inference_steps: 4,
      }
    } : {
      input: {
        prompt: fullPrompt,
        negative_prompt: negativePrompt,
        width: 1024,
        height: 1024,
        num_inference_steps: 40,
        guidance_scale: 7.5,
        scheduler: 'K_EULER',
      }
    }
  );

  // SDK v1.x retorna FileOutput, no string directa
  const fileOutput = Array.isArray(output) ? output[0] : output;
  console.log(`  ⬇  Descargando imagen...`);

  if (typeof fileOutput === 'string') {
    return await downloadImage(fileOutput);
  } else if (fileOutput && typeof fileOutput.url === 'function') {
    const u = fileOutput.url();
    return await downloadImage(u.href || u.toString());
  } else if (fileOutput && typeof fileOutput.blob === 'function') {
    const blob = await fileOutput.blob();
    const ab = await blob.arrayBuffer();
    return Buffer.from(ab);
  } else {
    throw new Error(`Formato de output desconocido: ${typeof fileOutput}`);
  }
  } catch (err) {
    // Rate limit 429 — esperar y reintentar
    if (err.message && err.message.includes('429') && attempt < 5) {
      const match = err.message.match(/retry_after":(\d+)/);
      const wait = ((match ? parseInt(match[1]) : 15) + 3) * 1000;
      console.log(`  ⏳ Rate limit, esperando ${wait/1000}s...`);
      await sleep(wait);
      return generateAIImage(nft, attempt + 1);
    }
    throw err;
  }
}

// ── Renderiza símbolo Unicode con puppeteer/Chrome (soporte Unicode completo) ─
let _browser = null;
async function getBrowser() {
  if (!_browser) _browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  return _browser;
}

async function renderSymbolPng(symbol, color, size) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 2 });
  await page.setContent(`<!DOCTYPE html><html><head><style>
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:${size}px;height:${size}px;background:transparent;display:flex;align-items:center;justify-content:center;overflow:hidden}
    span{font-size:${Math.round(size*0.68)}px;line-height:1;color:${color};font-family:'Apple Symbols','Segoe UI Symbol','DejaVu Sans','Arial Unicode MS',serif}
  </style></head><body><span>${symbol}</span></body></html>`);
  await page.waitForFunction(() => document.fonts.ready);
  const buf = await page.screenshot({ type: 'png', omitBackground: true,
    clip: { x: 0, y: 0, width: size, height: size } });
  await page.close();
  return buf;
}

// ── Dibuja símbolo zodiacal como paths de canvas (sin depender de fuentes) ───
function drawZodiacSymbol(ctx, nftId, cx, cy, sz) {
  const s = sz / 100;
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.lineWidth = 5.5 * s;

  switch (nftId) {
    case 0: { // Genesis ✦ — estrella 4 puntas
      const ro = 36*s, ri = 14*s;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI/4 - Math.PI/2, r = i%2===0 ? ro : ri;
        i===0 ? ctx.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a)) : ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));
      }
      ctx.closePath(); ctx.fill(); break;
    }
    case 1: { // Aries ♈ — dos arcos hacia arriba + barra central
      const hornR = 20*s, hornY = cy - 4*s;
      ctx.beginPath(); ctx.moveTo(cx, cy+30*s); ctx.lineTo(cx, hornY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-28*s, cy+30*s); ctx.lineTo(cx+28*s, cy+30*s); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx-hornR, hornY, hornR, 0, Math.PI, true); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+hornR, hornY, hornR, Math.PI, 0, false); ctx.stroke();
      break;
    }
    case 2: { // Taurus ♉ — círculo con dos cuernos
      const cR = 24*s, cY = cy+8*s, hornR = 22*s, hornY = cY-cR;
      ctx.beginPath(); ctx.arc(cx, cY, cR, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx-hornR, hornY, hornR, 0, Math.PI, true); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+hornR, hornY, hornR, Math.PI, 0, false); ctx.stroke();
      break;
    }
    case 3: { // Gemini ♊ — II con barras arriba y abajo
      const t=cy-32*s, b=cy+32*s;
      ctx.beginPath(); ctx.moveTo(cx-14*s,t); ctx.lineTo(cx-14*s,b); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+14*s,t); ctx.lineTo(cx+14*s,b); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-28*s,t); ctx.lineTo(cx+28*s,t); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-28*s,b); ctx.lineTo(cx+28*s,b); ctx.stroke();
      break;
    }
    case 4: { // Cancer ♋ — dos medias lunas (6+9)
      ctx.beginPath(); ctx.arc(cx, cy-14*s, 18*s, Math.PI*0.6, Math.PI*1.4, false); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx-18*s, cy-14*s, 5*s, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy+14*s, 18*s, Math.PI*1.6, Math.PI*0.4, false); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+18*s, cy+14*s, 5*s, 0, Math.PI*2); ctx.fill();
      break;
    }
    case 5: { // Leo ♌ — círculo + cola en espiral
      ctx.beginPath(); ctx.arc(cx-12*s, cy+8*s, 22*s, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx+10*s, cy+8*s);
      ctx.bezierCurveTo(cx+38*s, cy+8*s, cx+44*s, cy-22*s, cx+28*s, cy-30*s);
      ctx.bezierCurveTo(cx+14*s, cy-38*s, cx+4*s, cy-22*s, cx+18*s, cy-18*s);
      ctx.stroke(); break;
    }
    case 6: { // Virgo ♍ — forma M con bucle inferior derecho
      const t=cy-28*s, b=cy+24*s;
      ctx.beginPath();
      ctx.moveTo(cx-30*s, b); ctx.lineTo(cx-30*s, t+12*s);
      ctx.bezierCurveTo(cx-30*s,t, cx-12*s,t, cx-12*s,t+14*s);
      ctx.bezierCurveTo(cx-12*s,t, cx+4*s,t, cx+4*s,t+14*s);
      ctx.lineTo(cx+4*s, b); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx+4*s, b);
      ctx.bezierCurveTo(cx+4*s,b+16*s, cx+28*s,b+16*s, cx+28*s,b);
      ctx.bezierCurveTo(cx+28*s,b-18*s, cx+10*s,b-18*s, cx+10*s,b-4*s);
      ctx.stroke(); break;
    }
    case 7: { // Libra ♎ — arco sobre línea + línea abajo
      ctx.beginPath(); ctx.moveTo(cx-34*s,cy+22*s); ctx.lineTo(cx+34*s,cy+22*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-34*s,cy+4*s); ctx.lineTo(cx+34*s,cy+4*s); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy+4*s, 26*s, Math.PI, 0, false); ctx.stroke();
      break;
    }
    case 8: { // Scorpio ♏ — M + aguijón con flecha
      const t=cy-24*s, b=cy+10*s;
      ctx.beginPath();
      ctx.moveTo(cx-30*s, b); ctx.lineTo(cx-30*s, t+12*s);
      ctx.bezierCurveTo(cx-30*s,t, cx-12*s,t, cx-12*s,t+14*s);
      ctx.bezierCurveTo(cx-12*s,t, cx+4*s,t, cx+4*s,t+14*s);
      ctx.lineTo(cx+4*s, b); ctx.lineTo(cx+26*s, b); ctx.stroke();
      // Punta de flecha
      ctx.beginPath(); ctx.moveTo(cx+26*s,b); ctx.lineTo(cx+14*s,b-16*s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx+26*s,b); ctx.lineTo(cx+26*s,b+10*s); ctx.stroke();
      break;
    }
    case 9: { // Sagittarius ♐ — flecha diagonal NE + travesaño
      ctx.beginPath(); ctx.moveTo(cx-26*s,cy+26*s); ctx.lineTo(cx+26*s,cy-26*s); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx+26*s,cy-26*s); ctx.lineTo(cx+8*s,cy-26*s);
      ctx.moveTo(cx+26*s,cy-26*s); ctx.lineTo(cx+26*s,cy-8*s);
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx-14*s,cy+4*s); ctx.lineTo(cx+4*s,cy-14*s); ctx.stroke();
      break;
    }
    case 10: { // Capricorn ♑ — V angular + curva S de cola
      ctx.beginPath();
      ctx.moveTo(cx-26*s,cy-28*s); ctx.lineTo(cx-6*s,cy+8*s); ctx.lineTo(cx+2*s,cy-16*s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx+2*s,cy-16*s);
      ctx.bezierCurveTo(cx+20*s,cy-22*s, cx+28*s,cy-8*s, cx+18*s,cy+4*s);
      ctx.bezierCurveTo(cx+8*s,cy+16*s, cx+4*s,cy+30*s, cx+24*s,cy+28*s);
      ctx.stroke(); break;
    }
    case 11: { // Aquarius ♒ — dos líneas onduladas
      [cy-12*s, cy+12*s].forEach(y => {
        ctx.beginPath();
        ctx.moveTo(cx-34*s, y);
        ctx.bezierCurveTo(cx-22*s,y-20*s, cx-10*s,y-20*s, cx,y);
        ctx.bezierCurveTo(cx+10*s,y+20*s, cx+22*s,y+20*s, cx+34*s,y);
        ctx.stroke();
      }); break;
    }
    case 12: { // Pisces ♓ — dos arcos + barra vertical central
      ctx.beginPath(); ctx.arc(cx-16*s,cy,24*s,Math.PI*0.35,Math.PI*1.65,false); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx+16*s,cy,24*s,Math.PI*1.35,Math.PI*0.65,true); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,cy-22*s); ctx.lineTo(cx,cy+22*s); ctx.stroke();
      break;
    }
  }
  ctx.restore();
}

// ── Overlay canvas: constelación + símbolo + branding ────────────────────────
async function compositeNFT(nft, aiImageBuffer) {
  const W = 1000, H = 1000;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const [cr, cg, cb]   = hexToRgb(nft.color);
  const [cr2,cg2,cb2]  = hexToRgb(nft.c2);
  const cData = CONSTELLATIONS[Object.keys(CONSTELLATIONS).find(k =>
    NFTs.find(n => n.id === nft.id)?.id === nft.id
      ? k === (['genesis','aries','tauro','geminis','cancer','leo','virgo','libra','escorpio','sagitario','capricornio','acuario','piscis'][nft.id])
      : false
  ) || ['genesis','aries','tauro','geminis','cancer','leo','virgo','libra','escorpio','sagitario','capricornio','acuario','piscis'][nft.id]];

  // 1. Imagen AI como fondo completo
  const aiImg = await loadImage(aiImageBuffer);
  ctx.drawImage(aiImg, 0, 0, W, H);

  // 2. Overlay oscuro sutil para que el branding sea legible
  const overlay = ctx.createLinearGradient(0, 0, 0, H);
  overlay.addColorStop(0,   'rgba(10,0,30,0.35)');
  overlay.addColorStop(0.3, 'rgba(10,0,30,0.10)');
  overlay.addColorStop(0.7, 'rgba(10,0,30,0.10)');
  overlay.addColorStop(1,   'rgba(10,0,30,0.55)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  // 3. Constelación
  const PADX=0.08, ATOP=0.10, ABOT=0.82;
  const stars = cData.stars.map(s => ({
    px: (PADX + s[0] * (1 - PADX*2)) * W,
    py: ATOP*H + s[1] * (ABOT - ATOP) * H,
    r: s[2] ?? 4,
  }));

  // Líneas constelación
  cData.lines.forEach(([a, b]) => {
    const sa = stars[a], sb = stars[b];
    if (!sa || !sb) return;
    // Glow
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.20)`; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(sa.px, sa.py); ctx.lineTo(sb.px, sb.py); ctx.stroke();
    // Línea media
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.55)`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sa.px, sa.py); ctx.lineTo(sb.px, sb.py); ctx.stroke();
    // Línea fina blanca
    ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(sa.px, sa.py); ctx.lineTo(sb.px, sb.py); ctx.stroke();
  });

  // Nodos estrella
  stars.forEach(s => {
    const isMain = s.r >= 5;
    const nr = s.r * (isMain ? 3.5 : 3);
    // Halo
    const halo = ctx.createRadialGradient(s.px, s.py, 0, s.px, s.py, nr*3);
    halo.addColorStop(0, `rgba(${cr},${cg},${cb},${isMain?0.25:0.15})`);
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(s.px, s.py, nr*3, 0, Math.PI*2); ctx.fill();
    // Anillo
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},${isMain?0.85:0.65})`; ctx.lineWidth = isMain ? 1.8 : 1.2;
    ctx.shadowColor = `rgba(${cr},${cg},${cb},0.9)`; ctx.shadowBlur = isMain ? 18 : 10;
    ctx.beginPath(); ctx.arc(s.px, s.py, nr, 0, Math.PI*2); ctx.stroke();
    // Punto
    ctx.shadowBlur = isMain ? 14 : 8;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.arc(s.px, s.py, s.r * (isMain?0.9:0.7), 0, Math.PI*2); ctx.fill();
    // Rayos
    if (isMain) {
      const sl = nr * 3.5;
      [[sl,0],[0,sl]].forEach(([dx, dy]) => {
        const g = ctx.createLinearGradient(s.px-dx,s.py-dy,s.px+dx,s.py+dy);
        g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(.5,'rgba(255,255,255,0.6)'); g.addColorStop(1,'rgba(255,255,255,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 0.9; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.moveTo(s.px-dx,s.py-dy); ctx.lineTo(s.px+dx,s.py+dy); ctx.stroke();
      });
    }
    ctx.shadowBlur = 0;
  });

  // 4. Símbolo zodiacal — esquina inferior derecha, prominente
  const sx = W - 80, sy = H - 90;
  // Fondo sólido oscuro para legibilidad
  ctx.fillStyle = 'rgba(8,0,25,0.82)';
  ctx.beginPath(); ctx.arc(sx, sy, 58, 0, Math.PI*2); ctx.fill();
  // Anillo exterior con color del elemento
  ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.90)`; ctx.lineWidth = 2.5;
  ctx.shadowColor = `rgba(${cr},${cg},${cb},1)`; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.arc(sx, sy, 58, 0, Math.PI*2); ctx.stroke();
  // Anillo interior decorativo
  ctx.strokeStyle = `rgba(${cr2},${cg2},${cb2},0.50)`; ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(sx, sy, 48, 0, Math.PI*2); ctx.stroke();
  // Halo de glow
  const orbGrad = ctx.createRadialGradient(sx,sy,0,sx,sy,58);
  orbGrad.addColorStop(0, `rgba(${cr},${cg},${cb},0.30)`);
  orbGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = orbGrad; ctx.beginPath(); ctx.arc(sx,sy,58,0,Math.PI*2); ctx.fill();
  // Símbolo — renderizado via SVG para soporte Unicode correcto
  // Símbolo — renderizado con Chrome (soporte Unicode exacto)
  const symSize = 100;
  const symBuf = await renderSymbolPng(nft.symbol, '#ffffff', symSize);
  const symImg = await loadImage(symBuf);
  ctx.shadowColor = `rgba(${cr},${cg},${cb},1)`; ctx.shadowBlur = 28;
  ctx.drawImage(symImg, sx - symSize/2, sy - symSize/2, symSize, symSize);
  ctx.shadowBlur = 0;

  // 5. UI branding
  const lineG = () => {
    const g = ctx.createLinearGradient(0,0,W,0);
    g.addColorStop(0,'rgba(0,0,0,0)');
    g.addColorStop(0.12,`rgba(${cr},${cg},${cb},0.60)`);
    g.addColorStop(0.88,`rgba(${cr},${cg},${cb},0.60)`);
    g.addColorStop(1,'rgba(0,0,0,0)');
    return g;
  };
  ctx.strokeStyle = lineG(); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0,74); ctx.lineTo(W,74); ctx.stroke();

  // Logo
  ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.font = 'bold 24px Georgia,serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.shadowColor = `rgba(${cr},${cg},${cb},0.7)`; ctx.shadowBlur = 12;
  ctx.fillText('Om Domo', 28, 40);
  ctx.shadowBlur = 0;
  ctx.fillStyle = `rgba(${cr},${cg},${cb},0.80)`; ctx.font = '11px sans-serif';
  ctx.fillText('NFT · AVALANCHE MAINNET', 28, 60);

  // Badge rarity
  ctx.fillStyle = `rgba(${cr},${cg},${cb},0.12)`;
  roundRect(ctx, W-188, 14, 168, 48, 24); ctx.fill();
  ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.60)`; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = `rgba(${cr},${cg},${cb},1)`; ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('GENESIS · ERC-1155', W-104, 32);
  ctx.fillStyle = 'rgba(255,255,255,0.50)'; ctx.font = '10px sans-serif';
  ctx.fillText(nft.element.toUpperCase(), W-104, 50);

  // Línea inferior
  ctx.strokeStyle = lineG(); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0,H*.852); ctx.lineTo(W,H*.852); ctx.stroke();

  // Watermark
  ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.font = '11px monospace';
  ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(`#${nft.id} · web3.omdomo.com`, W-24, H-18);

  // Marco
  const fg = ctx.createLinearGradient(0,0,W,H);
  fg.addColorStop(0,`rgba(${cr},${cg},${cb},0.75)`);
  fg.addColorStop(.5,`rgba(${cr2},${cg2},${cb2},0.20)`);
  fg.addColorStop(1,`rgba(${cr},${cg},${cb},0.75)`);
  ctx.strokeStyle = fg; ctx.lineWidth = 2.5; ctx.strokeRect(5,5,W-10,H-10);
  ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.10)`; ctx.lineWidth = 1; ctx.strokeRect(13,13,W-26,H-26);
  ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.80)`; ctx.lineWidth = 2;
  [[13,13],[W-13,13],[13,H-13],[W-13,H-13]].forEach(([px,py],i)=>{
    const dx=i%2===0?30:-30, dy=i<2?30:-30;
    ctx.beginPath(); ctx.moveTo(px,py+dy); ctx.lineTo(px,py); ctx.lineTo(px+dx,py); ctx.stroke();
  });

  return canvas.toBuffer('image/png');
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('❌ Falta REPLICATE_API_TOKEN en .env.local');
    process.exit(1);
  }

  // Opción: generar solo un signo para testear
  const testId = process.argv[2] !== undefined ? parseInt(process.argv[2]) : null;
  const list   = testId !== null ? [NFTs[testId]] : NFTs;

  console.log(`\n🚀 Generando ${list.length} NFT(s) con Replicate AI...\n`);

  for (let i = 0; i < list.length; i++) {
    const nft = list[i];
    console.log(`\n[${nft.id}/12] ${nft.nameES}`);
    try {
      const aiBuffer  = await generateAIImage(nft);
      const finalPng  = await compositeNFT(nft, aiBuffer);
      const outPath   = path.join(OUT_DIR, `${nft.id}.png`);
      fs.writeFileSync(outPath, finalPng);
      console.log(`  ✅ Guardado: ${nft.id}.png`);
    } catch (err) {
      console.error(`  ❌ Error en ${nft.nameES}:`, err.message);
    }
    // Pausa entre requests para respetar rate limit (6/min con crédito bajo)
    if (i < list.length - 1) await sleep(11000);
  }

  console.log('\n✅ Generación completa en public/nft-assets/');
  if (_browser) await _browser.close();
}

main();
