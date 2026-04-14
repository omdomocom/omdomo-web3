#!/usr/bin/env node
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const OUT_DIR = path.join(__dirname, '../public/nft-assets');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Constelaciones ─────────────────────────────────────────────────────────────
const CONSTELLATIONS = {
  genesis:    { label:'GENESIS · SACRED GEOMETRY', stars:[{x:.50,y:.50,r:7},{x:.50,y:.22,r:5},{x:.74,y:.34,r:5},{x:.74,y:.62,r:5},{x:.50,y:.74,r:5},{x:.26,y:.62,r:5},{x:.26,y:.34,r:5}], lines:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,2],[2,3],[3,4],[4,5],[5,6],[6,1]] },
  aries:      { label:'ARIES · THE RAM',            stars:[{x:.18,y:.52,r:6},{x:.34,y:.36,r:5},{x:.52,y:.40,r:4},{x:.68,y:.34,r:5},{x:.82,y:.24,r:4}], lines:[[0,1],[1,2],[2,3],[3,4]] },
  tauro:      { label:'TAURUS · THE BULL',          stars:[{x:.16,y:.68,r:4},{x:.30,y:.54,r:4},{x:.48,y:.44,r:7},{x:.66,y:.54,r:4},{x:.80,y:.64,r:4},{x:.60,y:.26,r:5},{x:.74,y:.16,r:4}], lines:[[0,1],[1,2],[2,3],[3,4],[2,5],[5,6]] },
  geminis:    { label:'GEMINI · THE TWINS',         stars:[{x:.34,y:.14,r:6},{x:.64,y:.14,r:6},{x:.32,y:.30,r:4},{x:.62,y:.30,r:4},{x:.30,y:.48,r:4},{x:.60,y:.48,r:4},{x:.34,y:.64,r:5},{x:.64,y:.62,r:4}], lines:[[0,2],[2,4],[4,6],[1,3],[3,5],[5,7],[4,5],[6,7]] },
  cancer:     { label:'CANCER · THE CRAB',          stars:[{x:.24,y:.34,r:5},{x:.50,y:.26,r:4},{x:.74,y:.34,r:5},{x:.28,y:.64,r:4},{x:.50,y:.72,r:6},{x:.72,y:.64,r:4}], lines:[[0,1],[1,2],[0,3],[2,5],[3,4],[4,5]] },
  leo:        { label:'LEO · THE LION',             stars:[{x:.16,y:.72,r:7},{x:.32,y:.56,r:5},{x:.46,y:.42,r:4},{x:.60,y:.30,r:5},{x:.76,y:.20,r:6},{x:.74,y:.46,r:4},{x:.64,y:.60,r:4}], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[1,6]] },
  virgo:      { label:'VIRGO · THE MAIDEN',         stars:[{x:.50,y:.14,r:5},{x:.66,y:.24,r:4},{x:.76,y:.40,r:5},{x:.50,y:.64,r:7},{x:.30,y:.56,r:4},{x:.22,y:.40,r:4}], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]] },
  libra:      { label:'LIBRA · THE SCALES',         stars:[{x:.26,y:.50,r:6},{x:.74,y:.50,r:6},{x:.50,y:.26,r:5},{x:.50,y:.66,r:4},{x:.16,y:.66,r:4},{x:.82,y:.66,r:4}], lines:[[0,1],[0,2],[1,2],[0,3],[1,3],[0,4],[1,5]] },
  escorpio:   { label:'SCORPIUS · THE SCORPION',    stars:[{x:.18,y:.20,r:5},{x:.30,y:.26,r:4},{x:.46,y:.30,r:7},{x:.62,y:.26,r:4},{x:.72,y:.38,r:4},{x:.68,y:.50,r:4},{x:.60,y:.60,r:4},{x:.52,y:.68,r:4},{x:.44,y:.76,r:4},{x:.34,y:.84,r:5}], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9]] },
  sagitario:  { label:'SAGITTARIUS · THE ARCHER',   stars:[{x:.46,y:.16,r:4},{x:.62,y:.22,r:5},{x:.72,y:.34,r:4},{x:.66,y:.48,r:5},{x:.48,y:.56,r:6},{x:.30,y:.48,r:4},{x:.22,y:.34,r:4}], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]] },
  capricornio:{ label:'CAPRICORNUS · THE SEA-GOAT', stars:[{x:.10,y:.42,r:6},{x:.26,y:.32,r:4},{x:.44,y:.28,r:5},{x:.62,y:.32,r:4},{x:.78,y:.42,r:4},{x:.76,y:.58,r:4},{x:.62,y:.70,r:5},{x:.28,y:.68,r:4}], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0]] },
  acuario:    { label:'AQUARIUS · THE WATER BEARER', stars:[{x:.12,y:.36,r:6},{x:.28,y:.32,r:4},{x:.48,y:.38,r:5},{x:.64,y:.30,r:4},{x:.84,y:.36,r:4},{x:.18,y:.60,r:4},{x:.34,y:.56,r:4},{x:.54,y:.62,r:4},{x:.72,y:.56,r:4},{x:.88,y:.62,r:4}], lines:[[0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[8,9]] },
  piscis:     { label:'PISCES · THE FISH',          stars:[{x:.12,y:.48,r:5},{x:.22,y:.34,r:4},{x:.34,y:.28,r:4},{x:.44,y:.34,r:4},{x:.40,y:.52,r:4},{x:.88,y:.48,r:5},{x:.76,y:.34,r:4},{x:.64,y:.28,r:4},{x:.54,y:.34,r:4},{x:.58,y:.52,r:4}], lines:[[0,1],[1,2],[2,3],[3,4],[4,0],[5,6],[6,7],[7,8],[8,9],[9,5]] },
};

const NFTs = [
  { id:0,  nameES:"Génesis",    symbol:"✦",  color:"#fbbf24", c2:"#a78bfa", constellation:"genesis",     element:"Especial" },
  { id:1,  nameES:"Aries",      symbol:"♈",  color:"#22d3ee", c2:"#c026d3", constellation:"aries",       element:"Fuego"   },
  { id:2,  nameES:"Tauro",      symbol:"♉",  color:"#fbbf24", c2:"#2dd4bf", constellation:"tauro",       element:"Tierra"  },
  { id:3,  nameES:"Géminis",    symbol:"♊",  color:"#fbbf24", c2:"#06b6d4", constellation:"geminis",     element:"Aire"    },
  { id:4,  nameES:"Cáncer",     symbol:"♋",  color:"#38bdf8", c2:"#8b5cf6", constellation:"cancer",      element:"Agua"    },
  { id:5,  nameES:"Leo",        symbol:"♌",  color:"#f97316", c2:"#fbbf24", constellation:"leo",         element:"Fuego"   },
  { id:6,  nameES:"Virgo",      symbol:"♍",  color:"#818cf8", c2:"#38bdf8", constellation:"virgo",       element:"Tierra"  },
  { id:7,  nameES:"Libra",      symbol:"♎",  color:"#34d399", c2:"#22d3ee", constellation:"libra",       element:"Aire"    },
  { id:8,  nameES:"Escorpio",   symbol:"♏",  color:"#e879f9", c2:"#8b5cf6", constellation:"escorpio",    element:"Agua"    },
  { id:9,  nameES:"Sagitario",  symbol:"♐",  color:"#f59e0b", c2:"#f97316", constellation:"sagitario",   element:"Fuego"   },
  { id:10, nameES:"Capricornio",symbol:"♑",  color:"#2dd4bf", c2:"#818cf8", constellation:"capricornio", element:"Tierra"  },
  { id:11, nameES:"Acuario",    symbol:"♒",  color:"#60a5fa", c2:"#a78bfa", constellation:"acuario",     element:"Aire"    },
  { id:12, nameES:"Piscis",     symbol:"♓",  color:"#c084fc", c2:"#2dd4bf", constellation:"piscis",      element:"Agua"    },
];

function hexToRgb(h){ return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; }
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

// ── SVG Animales Zodiacales ────────────────────────────────────────────────────
function getAnimalSVG(key, c, c2) {
  const defs = `<defs>
    <filter id="n" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="6" result="b1"/>
      <feGaussianBlur stdDeviation="3" result="b2"/>
      <feMerge><feMergeNode in="b1"/><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="g" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="rg" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${c}" stop-opacity="0.85"/>
      <stop offset="60%" stop-color="${c}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity="0.15"/>
    </radialGradient>
    <radialGradient id="rg2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c2}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity="0.1"/>
    </radialGradient>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>`;

  const eye = (cx,cy,r=14) => `
    <circle cx="${cx}" cy="${cy}" r="${r*2}" fill="${c}" opacity="0.12"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#05001a"/>
    <circle cx="${cx}" cy="${cy}" r="${r*0.68}" fill="${c}" filter="url(#g)"/>
    <circle cx="${cx-r*0.28}" cy="${cy-r*0.32}" r="${r*0.26}" fill="white" opacity="0.95"/>
    <circle cx="${cx+r*0.12}" cy="${cy+r*0.08}" r="${r*0.11}" fill="white" opacity="0.6"/>`;

  const dot = (x,y,r=4,col=c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" filter="url(#s)"/>`;
  const sparkle = (x,y,s=8,col=c) => `
    <line x1="${x-s}" y1="${y}" x2="${x+s}" y2="${y}" stroke="${col}" stroke-width="1.5" filter="url(#s)"/>
    <line x1="${x}" y1="${y-s}" x2="${x}" y2="${y+s}" stroke="${col}" stroke-width="1.5" filter="url(#s)"/>
    <line x1="${x-s*.6}" y1="${y-s*.6}" x2="${x+s*.6}" y2="${y+s*.6}" stroke="${col}" stroke-width="1" opacity="0.6"/>
    <line x1="${x+s*.6}" y1="${y-s*.6}" x2="${x-s*.6}" y2="${y+s*.6}" stroke="${col}" stroke-width="1" opacity="0.6"/>`;

  const animals = {

    // ── GÉNESIS: Mandala sagrada ───────────────────────────────────────────────
    genesis: `
      <circle cx="200" cy="200" r="185" fill="url(#bg)"/>
      <circle cx="200" cy="200" r="165" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.35" filter="url(#g)"/>
      <circle cx="200" cy="200" r="130" fill="none" stroke="${c2}" stroke-width="1" opacity="0.3"/>
      <circle cx="200" cy="200" r="90"  fill="none" stroke="${c}" stroke-width="1" opacity="0.25"/>
      ${[0,1,2,3,4,5].map(i=>{const a=i*60*Math.PI/180;const ox=Math.cos(a)*75,oy=Math.sin(a)*75;return `<circle cx="${200+ox}" cy="${200+oy}" r="75" fill="none" stroke="${c}" stroke-width="1.2" opacity="0.45"/>`}).join('')}
      <polygon points="200,80 285,147 285,253 200,320 115,253 115,147" fill="${c}" fill-opacity="0.05" stroke="${c}" stroke-width="2" opacity="0.75" filter="url(#g)"/>
      <polygon points="200,320 115,147 285,147" fill="${c2}" fill-opacity="0.07" stroke="${c2}" stroke-width="1.5" opacity="0.6"/>
      <polygon points="200,80 285,253 115,253" fill="${c}" fill-opacity="0.07" stroke="${c}" stroke-width="1.5" opacity="0.6"/>
      ${[0,1,2,3,4,5].map(i=>{const a=i*60*Math.PI/180-Math.PI/2;return `${dot(200+130*Math.cos(a),200+130*Math.sin(a),7,i%2===0?c:c2)}`}).join('')}
      <circle cx="200" cy="200" r="42" fill="url(#rg)" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <circle cx="200" cy="200" r="28" fill="${c2}" fill-opacity="0.4" stroke="${c2}" stroke-width="1.5"/>
      <text x="200" y="212" font-size="40" font-family="serif" text-anchor="middle" fill="white" opacity="0.95" filter="url(#s)">✦</text>
      ${sparkle(200,55,12,c)} ${sparkle(345,127,10,c2)} ${sparkle(345,273,10,c)} ${sparkle(200,345,12,c2)} ${sparkle(55,273,10,c)} ${sparkle(55,127,10,c2)}`,

    // ── ARIES: Carnero con cuernos espirales ──────────────────────────────────
    aries: `
      <ellipse cx="200" cy="200" rx="185" ry="185" fill="url(#bg)"/>
      <path d="M 160 195 C 115 185 78 158 70 122 C 62 86 88 62 118 72 C 148 82 158 112 150 138 C 144 157 135 163 138 152"
            fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 160 195 C 115 185 78 158 70 122 C 62 86 88 62 118 72 C 148 82 158 112 150 138 C 144 157 135 163 138 152"
            fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
      <path d="M 240 195 C 285 185 322 158 330 122 C 338 86 312 62 282 72 C 252 82 242 112 250 138 C 256 157 265 163 262 152"
            fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 240 195 C 285 185 322 158 330 122 C 338 86 312 62 282 72 C 252 82 242 112 250 138 C 256 157 265 163 262 152"
            fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
      <circle cx="138" cy="148" r="10" fill="${c}" filter="url(#n)"/>
      <circle cx="262" cy="148" r="10" fill="${c}" filter="url(#n)"/>
      <ellipse cx="200" cy="185" rx="55" ry="48" fill="${c}" fill-opacity="0.15" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <ellipse cx="200" cy="185" rx="42" ry="36" fill="${c2}" fill-opacity="0.1"/>
      <path d="M 155 168 Q 170 155 200 152 Q 230 155 245 168" fill="none" stroke="${c}" stroke-width="2" opacity="0.6"/>
      <polygon points="200,148 210,162 200,176 190,162" fill="${c}" fill-opacity="0.7" filter="url(#g)"/>
      ${eye(174,182,13)} ${eye(226,182,13)}
      <ellipse cx="200" cy="215" rx="22" ry="16" fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="1.5"/>
      <circle cx="192" cy="217" r="6" fill="${c}" fill-opacity="0.5"/>
      <circle cx="208" cy="217" r="6" fill="${c}" fill-opacity="0.5"/>
      <path d="M 145 200 Q 148 190 155 195" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
      <path d="M 255 200 Q 252 190 245 195" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
      <ellipse cx="200" cy="258" rx="68" ry="42" fill="${c2}" fill-opacity="0.12" stroke="${c2}" stroke-width="1.5"/>
      <path d="M 145 248 Q 158 236 172 248 Q 186 236 200 248 Q 214 236 228 248 Q 242 236 255 248" fill="none" stroke="${c2}" stroke-width="1.5" opacity="0.6"/>
      ${dot(200,130,5)} ${dot(168,145,4,c2)} ${dot(232,145,4,c2)} ${dot(200,295,5,c2)}
      ${sparkle(60,80,10,c)} ${sparkle(340,80,10,c)} ${sparkle(60,310,8,c2)} ${sparkle(340,310,8,c2)}`,

    // ── TAURO: Toro con cuernos anchos ────────────────────────────────────────
    tauro: `
      <ellipse cx="200" cy="200" rx="185" ry="185" fill="url(#bg)"/>
      <path d="M 140 152 C 118 132 88 118 72 130 C 56 142 64 168 88 172 C 110 176 132 162 140 152 Z"
            fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="3" filter="url(#n)"/>
      <path d="M 260 152 C 282 132 312 118 328 130 C 344 142 336 168 312 172 C 290 176 268 162 260 152 Z"
            fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="3" filter="url(#n)"/>
      <path d="M 140 152 C 130 140 130 124 140 116 C 150 108 165 112 168 125"
            fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 260 152 C 270 140 270 124 260 116 C 250 108 235 112 232 125"
            fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" filter="url(#g)"/>
      <ellipse cx="200" cy="220" rx="88" ry="78" fill="${c}" fill-opacity="0.18" stroke="${c}" stroke-width="2.5" filter="url(#g)"/>
      <ellipse cx="200" cy="220" rx="75" ry="65" fill="${c2}" fill-opacity="0.1"/>
      <path d="M 130 190 Q 200 178 270 190" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/>
      <path d="M 128 210 Q 200 198 272 210" fill="none" stroke="${c}" stroke-width="1" opacity="0.35"/>
      <polygon points="200,172 212,186 200,200 188,186" fill="${c}" fill-opacity="0.8" filter="url(#g)"/>
      ${eye(170,215,15)} ${eye(230,215,15)}
      <ellipse cx="200" cy="260" rx="28" ry="20" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="1.5"/>
      <circle cx="188" cy="263" r="7" fill="${c}" fill-opacity="0.6"/>
      <circle cx="212" cy="263" r="7" fill="${c}" fill-opacity="0.6"/>
      <circle cx="200" cy="268" r="5" fill="${c2}" fill-opacity="0.5"/>
      <path d="M 150 240 Q 155 230 162 238" fill="none" stroke="${c2}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 250 240 Q 245 230 238 238" fill="none" stroke="${c2}" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="200" cy="310" rx="72" ry="38" fill="${c2}" fill-opacity="0.12" stroke="${c2}" stroke-width="1.5"/>
      ${dot(200,155,5)} ${dot(165,175,3,c2)} ${dot(235,175,3,c2)}
      ${sparkle(75,75,11,c)} ${sparkle(325,75,11,c)} ${sparkle(50,200,9,c2)} ${sparkle(350,200,9,c2)}`,

    // ── GÉMINIS: Los Gemelos ──────────────────────────────────────────────────
    geminis: `
      <ellipse cx="200" cy="200" rx="185" ry="185" fill="url(#bg)"/>
      <ellipse cx="138" cy="165" rx="42" ry="52" fill="${c}" fill-opacity="0.18" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <ellipse cx="262" cy="165" rx="42" ry="52" fill="${c}" fill-opacity="0.18" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <path d="M 108 128 C 112 108 130 100 138 102 C 146 100 160 108 162 128" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="2"/>
      <path d="M 238 128 C 242 108 254 100 262 102 C 270 100 284 108 288 128" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="2"/>
      <path d="M 108 126 C 95 110 90 88 100 72 C 110 56 128 60 132 76" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 292 126 C 305 110 310 88 300 72 C 290 56 272 60 268 76" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" filter="url(#g)"/>
      <circle cx="128" cy="72" r="8" fill="${c2}" filter="url(#g)"/>
      <circle cx="272" cy="72" r="8" fill="${c2}" filter="url(#g)"/>
      ${eye(128,158,11)} ${eye(148,158,11)}
      ${eye(252,158,11)} ${eye(272,158,11)}
      <ellipse cx="138" cy="182" rx="18" ry="12" fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="1"/>
      <ellipse cx="262" cy="182" rx="18" ry="12" fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="1"/>
      <rect x="168" y="200" width="64" height="8" rx="4" fill="url(#lg)" filter="url(#g)"/>
      <path d="M 180 208 L 180 248 M 220 208 L 220 248" stroke="${c2}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 175 248 L 225 248" stroke="${c2}" stroke-width="2.5"/>
      <path d="M 96 200 Q 96 258 138 268 Q 180 278 180 260" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 304 200 Q 304 258 262 268 Q 220 278 220 260" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 80 220 Q 72 240 88 258 Q 100 270 112 260" fill="none" stroke="${c}" stroke-width="2" opacity="0.6"/>
      <path d="M 320 220 Q 328 240 312 258 Q 300 270 288 260" fill="none" stroke="${c}" stroke-width="2" opacity="0.6"/>
      ${dot(200,200,5,c2)} ${dot(200,248,5,c)}
      ${sparkle(55,55,10,c)} ${sparkle(345,55,10,c)} ${sparkle(200,340,10,c2)}`,

    // ── CÁNCER: Cangrejo ──────────────────────────────────────────────────────
    cancer: `
      <ellipse cx="200" cy="200" rx="185" ry="185" fill="url(#bg)"/>
      <ellipse cx="200" cy="210" rx="68" ry="55" fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-width="2.5" filter="url(#g)"/>
      ${[0,1,2,3,4,5,6,7].map(i=>{const a=i*45*Math.PI/180;const r1=55,r2=68;return `<line x1="${200+r1*Math.cos(a)}" y1="${210+r1*Math.sin(a)}" x2="${200+r2*Math.cos(a)}" y2="${210+r2*Math.sin(a)}" stroke="${c}" stroke-width="1" opacity="0.4"/>`}).join('')}
      ${[0,1,2,3,4].map(i=>{const r=20+i*10;return `<ellipse cx="200" cy="210" rx="${r*1.25}" ry="${r}" fill="none" stroke="${c}" stroke-width="0.8" opacity="${0.4-i*0.06}"/>`}).join('')}
      <path d="M 138 170 C 108 148 80 148 68 168 C 56 188 72 212 98 208 C 118 205 132 190 138 178"
            fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="3" filter="url(#n)"/>
      <path d="M 138 170 C 105 158 88 140 95 125 C 100 114 115 115 122 125" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" filter="url(#g)"/>
      <ellipse cx="78" cy="188" rx="22" ry="16" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <path d="M 262 170 C 292 148 320 148 332 168 C 344 188 328 212 302 208 C 282 205 268 190 262 178"
            fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="3" filter="url(#n)"/>
      <path d="M 262 170 C 295 158 312 140 305 125 C 300 114 285 115 278 125" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" filter="url(#g)"/>
      <ellipse cx="322" cy="188" rx="22" ry="16" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      ${[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sy],i)=>`<path d="M ${200+sx*68} ${210+sy*10} C ${200+sx*95} ${210+sy*8} ${200+sx*115} ${210+sy*18} ${200+sx*120} ${210+sy*32}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" opacity="0.65"/>`).join('')}
      ${[[-1,0],[1,0]].map(([sx],i)=>`<path d="M ${200+sx*68} 210 C ${200+sx*96} 210 ${200+sx*118} 215 ${200+sx*122} 225" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" opacity="0.65"/>`).join('')}
      <ellipse cx="183" cy="175" rx="12" ry="16" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/>
      <ellipse cx="217" cy="175" rx="12" ry="16" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/>
      ${eye(183,175,10)} ${eye(217,175,10)}
      ${dot(200,210,5,c2)} ${dot(175,210,4,c)} ${dot(225,210,4,c)}
      ${sparkle(60,60,10,c)} ${sparkle(340,60,10,c)} ${sparkle(60,340,9,c2)} ${sparkle(340,340,9,c2)}`,

    // ── LEO: León con melena radiante ─────────────────────────────────────────
    leo: `
      <ellipse cx="200" cy="205" rx="185" ry="185" fill="url(#bg)"/>
      ${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{
        const a=i*30*Math.PI/180 - Math.PI/2;
        const r1=82, r2=148;
        const mx=(r1+r2)/2, wr=(r2-r1)/2;
        return `<path d="M ${200+r1*Math.cos(a)} ${205+r1*Math.sin(a)} C ${200+(mx-wr*0.4)*Math.cos(a-0.15)} ${205+(mx-wr*0.4)*Math.sin(a-0.15)} ${200+(mx+wr*0.4)*Math.cos(a+0.15)} ${205+(mx+wr*0.4)*Math.sin(a+0.15)} ${200+r2*Math.cos(a)} ${205+r2*Math.sin(a)}" fill="${c}" fill-opacity="${i%2===0?'0.55':'0.40'}" stroke="${i%2===0?c:c2}" stroke-width="1.5" filter="url(#s)"/>`;
      }).join('')}
      <circle cx="200" cy="205" r="148" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.4" filter="url(#g)"/>
      <circle cx="200" cy="205" r="82"  fill="${c}" fill-opacity="0.22" stroke="${c2}" stroke-width="2" filter="url(#g)"/>
      <ellipse cx="200" cy="210" rx="65" ry="60" fill="${c}" fill-opacity="0.28"/>
      <ellipse cx="175" cy="195" rx="14" ry="10" fill="${c}" fill-opacity="0.5" stroke="${c}" stroke-width="1" opacity="0.5"/>
      <ellipse cx="225" cy="195" rx="14" ry="10" fill="${c}" fill-opacity="0.5" stroke="${c}" stroke-width="1" opacity="0.5"/>
      <path d="M 160 178 C 172 166 190 162 200 165 C 210 162 228 166 240 178" fill="none" stroke="${c2}" stroke-width="2" opacity="0.7"/>
      <polygon points="200,160 208,172 200,184 192,172" fill="${c2}" fill-opacity="0.85" filter="url(#g)"/>
      ${eye(175,198,14)} ${eye(225,198,14)}
      <ellipse cx="200" cy="238" rx="28" ry="18" fill="${c}" fill-opacity="0.35" stroke="${c}" stroke-width="1.5"/>
      <path d="M 178 234 Q 200 228 222 234" fill="none" stroke="${c2}" stroke-width="2" opacity="0.7"/>
      <circle cx="188" cy="243" r="6" fill="${c}" fill-opacity="0.55"/>
      <circle cx="212" cy="243" r="6" fill="${c}" fill-opacity="0.55"/>
      <path d="M 160 210 Q 148 218 152 230 Q 156 242 168 238" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.55"/>
      <path d="M 240 210 Q 252 218 248 230 Q 244 242 232 238" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.55"/>
      <path d="M 200 265 Q 208 278 200 295 Q 192 278 200 265" fill="${c}" fill-opacity="0.4" stroke="${c}" stroke-width="1.5"/>
      ${dot(200,148,6,c2)} ${dot(165,162,4,c)} ${dot(235,162,4,c)}
      ${[0,1,2,3,4,5].map(i=>{const a=i*60*Math.PI/180-Math.PI/2;return dot(200+148*Math.cos(a),205+148*Math.sin(a),5,i%2===0?c:c2)}).join('')}`,

    // ── VIRGO: La Doncella ────────────────────────────────────────────────────
    virgo: `
      <ellipse cx="200" cy="200" rx="185" ry="185" fill="url(#bg)"/>
      <ellipse cx="200" cy="145" rx="48" ry="52" fill="${c}" fill-opacity="0.15" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <path d="M 160 130 C 155 108 162 88 172 80 C 182 72 198 75 200 85" fill="none" stroke="${c2}" stroke-width="2.5" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 240 130 C 245 108 238 88 228 80 C 218 72 202 75 200 85" fill="none" stroke="${c2}" stroke-width="2.5" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 155 125 C 130 118 108 125 98 140 C 88 158 95 178 112 182" fill="none" stroke="${c}" stroke-width="2" opacity="0.6"/>
      <path d="M 245 125 C 270 118 292 125 302 140 C 312 158 305 178 288 182" fill="none" stroke="${c}" stroke-width="2" opacity="0.6"/>
      <path d="M 140 158 C 120 165 108 180 115 195 C 118 204 130 210 145 208" fill="${c}" fill-opacity="0.15" stroke="${c}" stroke-width="2" filter="url(#s)"/>
      <path d="M 260 158 C 280 165 292 180 285 195 C 282 204 270 210 255 208" fill="${c}" fill-opacity="0.15" stroke="${c}" stroke-width="2" filter="url(#s)"/>
      <path d="M 178 118 C 172 125 172 134 178 140 C 184 145 190 143 190 135" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/>
      <path d="M 222 118 C 228 125 228 134 222 140 C 216 145 210 143 210 135" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/>
      ${eye(182,140,11)} ${eye(218,140,11)}
      <path d="M 188 162 Q 200 167 212 162" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.7"/>
      <ellipse cx="200" cy="197" rx="52" ry="35" fill="${c}" fill-opacity="0.1" stroke="${c}" stroke-width="1.5"/>
      <path d="M 155 195 L 245 195" stroke="${c}" stroke-width="1" opacity="0.4"/>
      <path d="M 148 208 C 148 240 165 270 175 290" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 252 208 C 252 240 235 270 225 290" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 148 235 C 155 245 168 252 175 250" fill="none" stroke="${c2}" stroke-width="2" opacity="0.7"/>
      <path d="M 252 235 C 245 245 232 252 225 250" fill="none" stroke="${c2}" stroke-width="2" opacity="0.7"/>
      <path d="M 268 230 L 330 210 M 330 210 L 320 200 M 330 210 L 318 220" fill="none" stroke="${c2}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
      <path d="M 320 200 L 340 185" fill="none" stroke="${c2}" stroke-width="1.5" opacity="0.5"/>
      <path d="M 318 220 L 335 235" fill="none" stroke="${c2}" stroke-width="1.5" opacity="0.5"/>
      ${dot(200,82,6,c2)} ${dot(172,95,4,c)} ${dot(228,95,4,c)}
      ${sparkle(50,60,10,c)} ${sparkle(350,60,10,c2)} ${sparkle(200,350,9,c)}`,

    // ── LIBRA: La Balanza ─────────────────────────────────────────────────────
    libra: `
      <ellipse cx="200" cy="200" rx="185" ry="185" fill="url(#bg)"/>
      <line x1="200" y1="100" x2="200" y2="300" stroke="${c}" stroke-width="3" filter="url(#n)"/>
      <line x1="200" y1="100" x2="200" y2="300" stroke="${c}" stroke-width="1.5" opacity="0.9"/>
      <circle cx="200" cy="100" r="12" fill="${c2}" fill-opacity="0.8" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <rect x="185" y="300" width="30" height="6" rx="3" fill="url(#lg)"/>
      <path d="M 80 155 L 200 135 L 320 155" stroke="url(#lg)" stroke-width="4" fill="none" filter="url(#g)"/>
      <path d="M 80 155 L 200 135 L 320 155" stroke="${c}" stroke-width="1.5" fill="none" opacity="0.9"/>
      <line x1="80" y1="155" x2="80" y2="175" stroke="${c}" stroke-width="2" opacity="0.7"/>
      <line x1="320" y1="155" x2="320" y2="175" stroke="${c}" stroke-width="2" opacity="0.7"/>
      <path d="M 48 175 Q 80 165 112 175 Q 80 195 48 175 Z" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <path d="M 288 175 Q 320 165 352 175 Q 320 195 288 175 Z" fill="${c}" fill-opacity="0.3" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <path d="M 56 178 C 62 170 70 165 80 165" fill="none" stroke="${c2}" stroke-width="1.5" opacity="0.5"/>
      <path d="M 80 165 C 90 165 98 170 104 178" fill="none" stroke="${c2}" stroke-width="1.5" opacity="0.5"/>
      <path d="M 296 178 C 302 170 310 165 320 165" fill="none" stroke="${c2}" stroke-width="1.5" opacity="0.5"/>
      <path d="M 320 165 C 330 165 338 170 344 178" fill="none" stroke="${c2}" stroke-width="1.5" opacity="0.5"/>
      <path d="M 62 178 Q 80 195 40 205 Q 62 205 62 178" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/>
      <path d="M 338 178 Q 320 195 360 205 Q 338 205 338 178" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.5"/>
      <circle cx="80" cy="218" r="22" fill="none" stroke="${c2}" stroke-width="2" opacity="0.7" filter="url(#g)"/>
      <path d="M 64 210 Q 80 200 96 210" fill="none" stroke="${c2}" stroke-width="2" opacity="0.8"/>
      <circle cx="320" cy="218" r="22" fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <circle cx="320" cy="218" r="10" fill="${c}" fill-opacity="0.5"/>
      ${[0,1,2,3,4,5,6,7,8,9,11].map(i=>{const a=i*30*Math.PI/180;return `<line x1="${320}" y1="${218}" x2="${320+22*Math.cos(a)}" y2="${218+22*Math.sin(a)}" stroke="${c}" stroke-width="1" opacity="0.5"/>`}).join('')}
      ${dot(200,135,5,c2)} ${dot(80,155,5,c)} ${dot(320,155,5,c)}
      ${dot(200,300,6,c2)} ${dot(200,240,4,c)}
      ${sparkle(55,55,10,c)} ${sparkle(345,55,10,c2)} ${sparkle(200,55,9,c)}`,

    // ── ESCORPIO: El Escorpión ────────────────────────────────────────────────
    escorpio: `
      <ellipse cx="200" cy="200" rx="185" ry="185" fill="url(#bg)"/>
      <ellipse cx="195" cy="200" rx="72" ry="55" fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-width="2.5" filter="url(#g)"/>
      ${[0,1,2,3,4].map(i=>`<ellipse cx="195" cy="200" rx="${24+i*10}" ry="${18+i*7}" fill="none" stroke="${c}" stroke-width="0.8" opacity="${0.5-i*0.08}"/>`).join('')}
      <path d="M 135 192 C 95 175 70 178 60 198 C 50 218 65 240 90 238 C 112 236 132 218 135 200"
            fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-width="3" filter="url(#n)"/>
      <ellipse cx="70" cy="218" rx="25" ry="18" fill="${c}" fill-opacity="0.35" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <path d="M 58 208 C 48 202 40 198 38 210 C 36 222 46 228 55 222" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 58 228 C 48 234 40 238 38 226 C 36 214 46 208 55 214" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 255 192 C 295 175 320 178 330 198 C 340 218 325 240 300 238 C 278 236 262 218 255 200"
            fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-width="3" filter="url(#n)"/>
      <ellipse cx="320" cy="218" rx="25" ry="18" fill="${c}" fill-opacity="0.35" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <path d="M 332 208 C 342 202 350 198 352 210 C 354 222 344 228 335 222" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 332 228 C 342 234 350 238 352 226 C 354 214 344 208 335 214" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" filter="url(#g)"/>
      ${[[-1],[-1],[-1],[-1]].map((_,i)=>`<path d="M ${195+[-32,-16,16,32][i]} 255 L ${195+[-32,-16,16,32][i]} 285" stroke="${c}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>`).join('')}
      ${[[-1],[-1],[-1],[-1]].map((_,i)=>`<path d="M ${195+[-28,-12,12,28][i]} 255 L ${195+[-38,-18,18,38][i]} 280" stroke="${c}" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>`).join('')}
      <path d="M 195 255 C 235 260 268 248 275 228 C 282 208 265 195 255 200" fill="none" stroke="${c2}" stroke-width="4" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 275 228 C 285 208 302 200 315 212 C 325 222 318 240 305 242" fill="none" stroke="${c2}" stroke-width="4" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 305 242 C 320 244 335 232 325 218" fill="none" stroke="${c2}" stroke-width="4" stroke-linecap="round" filter="url(#n)"/>
      <polygon points="325,218 318,205 335,208" fill="${c2}" filter="url(#n)"/>
      ${eye(182,196,10)} ${eye(208,196,10)}
      ${dot(195,200,5,c2)} ${dot(162,200,4,c)} ${dot(228,200,4,c)}
      ${sparkle(55,55,10,c)} ${sparkle(345,55,10,c2)} ${sparkle(55,340,9,c2)} ${sparkle(345,340,9,c)}`,

    // ── SAGITARIO: El Arquero ─────────────────────────────────────────────────
    sagitario: `
      <ellipse cx="200" cy="200" rx="185" ry="185" fill="url(#bg)"/>
      <path d="M 78 322 L 312 88" stroke="url(#lg)" stroke-width="5" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 78 322 L 312 88" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity="0.9"/>
      <polygon points="312,88 282,105 295,120" fill="${c2}" fill-opacity="0.9" stroke="${c2}" stroke-width="1" filter="url(#g)"/>
      <path d="M 78 322 Q 68 322 62 318 Q 72 308 78 322" fill="${c}" fill-opacity="0.7"/>
      <path d="M 78 322 Q 78 332 74 338 Q 68 328 78 322" fill="${c}" fill-opacity="0.7"/>
      <path d="M 70 78 C 95 55 135 55 148 88 C 158 112 145 135 128 138"
            fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 128 138 C 115 142 100 135 95 122" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 70 78 C 72 100 80 118 95 122" fill="none" stroke="${c2}" stroke-width="3" stroke-linecap="round" filter="url(#g)"/>
      <line x1="128" y1="138" x2="185" y2="205" stroke="${c2}" stroke-width="2.5" stroke-linecap="round" filter="url(#g)" stroke-dasharray="8,5"/>
      <path d="M 330 78 C 305 55 265 55 252 88 C 242 112 255 135 272 138"
            fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 272 138 C 285 142 300 135 305 122" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 330 78 C 328 100 320 118 305 122" fill="none" stroke="${c2}" stroke-width="3" stroke-linecap="round" filter="url(#g)"/>
      <line x1="272" y1="138" x2="215" y2="205" stroke="${c2}" stroke-width="2.5" stroke-linecap="round" filter="url(#g)" stroke-dasharray="8,5"/>
      <circle cx="200" cy="205" r="12" fill="${c}" fill-opacity="0.4" stroke="${c2}" stroke-width="2" filter="url(#g)"/>
      ${sparkle(310,88,14,c2)}
      ${sparkle(75,78,10,c)} ${sparkle(325,78,10,c)} ${sparkle(78,322,10,c)}
      ${dot(148,95,5,c)} ${dot(252,95,5,c)} ${dot(200,160,4,c2)} ${dot(200,250,4,c2)}
      ${sparkle(155,310,9,c2)} ${sparkle(255,120,9,c)}`,

    // ── CAPRICORNIO: La Cabra marina ──────────────────────────────────────────
    capricornio: `
      <ellipse cx="200" cy="200" rx="185" ry="185" fill="url(#bg)"/>
      <ellipse cx="200" cy="145" rx="52" ry="55" fill="${c}" fill-opacity="0.15" stroke="${c}" stroke-width="2" filter="url(#g)"/>
      <path d="M 162 118 C 148 100 140 78 148 62 C 156 48 170 48 178 62 C 184 74 180 90 172 100"
            fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 172 100 C 160 112 155 124 158 135" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 238 118 C 252 100 260 78 252 62 C 244 48 230 48 222 62 C 216 74 220 90 228 100"
            fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 228 100 C 240 112 245 124 242 135" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" filter="url(#g)"/>
      <circle cx="148" cy="62" r="8" fill="${c2}" filter="url(#g)"/>
      <circle cx="252" cy="62" r="8" fill="${c2}" filter="url(#g)"/>
      <path d="M 158 145 C 148 160 150 175 162 182" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.6"/>
      <path d="M 242 145 C 252 160 250 175 238 182" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.6"/>
      <polygon points="200,130 210,144 200,158 190,144" fill="${c2}" fill-opacity="0.8" filter="url(#g)"/>
      ${eye(178,140,12)} ${eye(222,140,12)}
      <path d="M 188 168 Q 200 174 212 168" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.7"/>
      <ellipse cx="200" cy="195" rx="48" ry="30" fill="${c}" fill-opacity="0.1" stroke="${c}" stroke-width="1.5"/>
      <path d="M 152 225 C 145 248 148 272 155 292 C 162 312 175 330 190 342"
            fill="none" stroke="${c2}" stroke-width="4" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 248 225 C 255 248 252 272 245 292 C 238 312 225 330 210 342"
            fill="none" stroke="${c2}" stroke-width="4" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 155 260 C 168 268 185 268 200 265 C 215 268 232 268 245 260" fill="none" stroke="${c2}" stroke-width="2" opacity="0.6"/>
      <path d="M 158 290 C 172 300 188 302 200 300 C 212 302 228 300 242 290" fill="none" stroke="${c2}" stroke-width="2" opacity="0.5"/>
      <path d="M 162 318 C 174 326 188 330 200 328 C 212 330 226 326 238 318" fill="none" stroke="${c2}" stroke-width="1.5" opacity="0.4"/>
      <path d="M 190 342 C 195 348 205 348 210 342" fill="none" stroke="${c2}" stroke-width="3" opacity="0.7"/>
      ${dot(200,110,5,c)} ${dot(168,125,4,c2)} ${dot(232,125,4,c2)}
      ${sparkle(55,55,10,c)} ${sparkle(345,55,10,c2)} ${sparkle(130,355,9,c)} ${sparkle(270,355,9,c2)}`,

    // ── ACUARIO: El Aguador ───────────────────────────────────────────────────
    acuario: `
      <ellipse cx="200" cy="200" rx="185" ry="185" fill="url(#bg)"/>
      <path d="M 152 75 C 145 65 135 62 125 68 C 115 74 115 88 122 98 C 130 108 145 110 158 105 C 170 100 178 90 182 78 C 186 66 182 55 175 50"
            fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 175 50 C 172 42 162 40 155 45" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="155" cy="72" rx="35" ry="28" fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-width="2"/>
      <path d="M 130 62 L 175 75 L 168 95 L 123 82 Z" fill="${c}" fill-opacity="0.15" stroke="${c}" stroke-width="1.5"/>
      <path d="M 155 100 C 148 115 145 130 150 148" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
      <path d="M 150 148 C 150 148 125 140 108 160 C 92 178 100 205 118 215 C 132 222 148 215 152 202" fill="${c}" fill-opacity="0.18" stroke="${c}" stroke-width="2.5" filter="url(#g)"/>
      <path d="M 60 198 Q 90 182 120 198 Q 150 214 180 198 Q 210 182 240 198 Q 270 214 300 198 Q 330 182 355 198"
            fill="none" stroke="${c2}" stroke-width="3.5" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 60 198 Q 90 182 120 198 Q 150 214 180 198 Q 210 182 240 198 Q 270 214 300 198 Q 330 182 355 198"
            fill="none" stroke="${c2}" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
      <path d="M 50 228 Q 80 212 110 228 Q 140 244 170 228 Q 200 212 230 228 Q 260 244 290 228 Q 320 212 350 228"
            fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round" filter="url(#n)"/>
      <path d="M 50 228 Q 80 212 110 228 Q 140 244 170 228 Q 200 212 230 228 Q 260 244 290 228 Q 320 212 350 228"
            fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
      <path d="M 60 258 Q 90 242 120 258 Q 150 274 180 258 Q 210 242 240 258 Q 270 274 300 258 Q 330 242 355 258"
            fill="none" stroke="${c2}" stroke-width="3" stroke-linecap="round" filter="url(#g)"/>
      <path d="M 70 288 Q 100 272 130 288 Q 160 304 190 288 Q 220 272 250 288 Q 280 304 310 288 Q 335 275 345 288"
            fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
      ${[60,120,180,240,300].map(x=>`${dot(x,198,4,c2)}`).join('')}
      ${[50,110,170,230,290,350].map(x=>`${dot(x,228,3,c)}`).join('')}
      ${sparkle(155,50,11,c)} ${sparkle(340,55,10,c2)} ${sparkle(50,170,9,c)} ${sparkle(350,170,9,c2)}`,

    // ── PISCIS: Los Peces ─────────────────────────────────────────────────────
    piscis: `
      <ellipse cx="200" cy="200" rx="185" ry="185" fill="url(#bg)"/>
      <circle cx="200" cy="200" r="152" fill="none" stroke="${c}" stroke-width="1.2" opacity="0.25" filter="url(#g)"/>
      <path d="M 200 80 C 265 80 318 128 318 200 C 318 272 265 320 200 320"
            fill="none" stroke="${c}" stroke-width="2" opacity="0.4"/>
      <path d="M 200 80 C 135 80 82 128 82 200 C 82 272 135 320 200 320"
            fill="none" stroke="${c2}" stroke-width="2" opacity="0.4"/>
      <path d="M 200 80 C 240 90 278 130 282 175 C 286 220 265 262 240 282 C 215 300 200 298 192 285 C 178 262 178 225 188 200 C 200 172 200 130 200 80 Z"
            fill="${c}" fill-opacity="0.25" stroke="${c}" stroke-width="2.5" filter="url(#g)"/>
      <path d="M 282 175 C 295 162 315 160 325 170" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
      <path d="M 282 178 C 295 190 315 192 325 182" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
      <path d="M 200 320 C 160 310 122 270 118 225 C 114 180 135 138 160 118 C 185 100 200 102 208 115 C 222 138 222 175 212 200 C 200 228 200 270 200 320 Z"
            fill="${c2}" fill-opacity="0.25" stroke="${c2}" stroke-width="2.5" filter="url(#g)"/>
      <path d="M 118 225 C 105 238 85 240 75 230" fill="none" stroke="${c2}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
      <path d="M 118 222 C 105 210 85 208 75 218" fill="none" stroke="${c2}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
      ${eye(255,152,12)}
      ${eye(145,248,12)}
      <path d="M 268 168 Q 278 175 268 182" fill="none" stroke="${c}" stroke-width="2" opacity="0.6"/>
      <path d="M 132 232 Q 122 225 132 218" fill="none" stroke="${c2}" stroke-width="2" opacity="0.6"/>
      <line x1="82" y1="200" x2="318" y2="200" stroke="white" stroke-width="1.5" opacity="0.2"/>
      <circle cx="200" cy="200" r="10" fill="${c}" fill-opacity="0.4" stroke="${c}" stroke-width="2"/>
      <circle cx="200" cy="200" r="4" fill="white" opacity="0.8"/>
      ${dot(200,80,6,c)} ${dot(200,320,6,c2)} ${dot(318,200,5,c)} ${dot(82,200,5,c2)}
      ${sparkle(55,55,10,c)} ${sparkle(345,55,10,c2)} ${sparkle(55,345,9,c2)} ${sparkle(345,345,9,c)}`,
  };

  return defs + (animals[key] || animals.genesis);
}

async function loadAnimalImage(key, color, c2) {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">${getAnimalSVG(key, color, c2)}</svg>`;
  return await loadImage(Buffer.from(svgContent));
}

// ── Nodo estrella ──────────────────────────────────────────────────────────────
function drawStarNode(ctx, px, py, size, cr, cg, cb) {
  const r = size * 2.5;
  const halo = ctx.createRadialGradient(px,py,0,px,py,r*3);
  halo.addColorStop(0,`rgba(${cr},${cg},${cb},0.18)`);
  halo.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=halo; ctx.beginPath(); ctx.arc(px,py,r*3,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=`rgba(255,255,255,0.75)`; ctx.lineWidth=size>=5?1.8:1.3;
  ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2); ctx.stroke();
  const dg=ctx.createRadialGradient(px,py,0,px,py,r*0.55);
  dg.addColorStop(0,'rgba(255,255,255,0.95)'); dg.addColorStop(1,`rgba(${cr},${cg},${cb},0.5)`);
  ctx.fillStyle=dg; ctx.beginPath(); ctx.arc(px,py,r*0.55,0,Math.PI*2); ctx.fill();
  if(size>=5){
    const sl=r*3;
    [[sl,0],[0,sl]].forEach(([dx,dy])=>{
      const g=ctx.createLinearGradient(px-dx,py-dy,px+dx,py+dy);
      g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,0.6)');g.addColorStop(1,'rgba(255,255,255,0)');
      ctx.strokeStyle=g;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(px-dx,py-dy);ctx.lineTo(px+dx,py+dy);ctx.stroke();
    });
  }
}

async function drawNFT(ctx, nft, W, H) {
  const [cr,cg,cb]  = hexToRgb(nft.color);
  const [cr2,cg2,cb2] = hexToRgb(nft.c2);
  const cData = CONSTELLATIONS[nft.constellation];

  // ── Fondo púrpura oscuro (estilo referencia) ────────────────────────────────
  const bg = ctx.createRadialGradient(W*.5,H*.42,0,W*.5,H*.42,W*.9);
  bg.addColorStop(0,'#1a0832');
  bg.addColorStop(0.4,'#0e051e');
  bg.addColorStop(1,'#040010');
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

  // Tinte elemento
  const tint=ctx.createRadialGradient(W*.5,H*.45,0,W*.5,H*.45,W*.65);
  tint.addColorStop(0,`rgba(${cr},${cg},${cb},0.12)`);
  tint.addColorStop(.5,`rgba(${cr2},${cg2},${cb2},0.06)`);
  tint.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=tint; ctx.fillRect(0,0,W,H);

  // Polvo estelar
  for(let i=0;i<280;i++){
    const px=(i*211.7+37)%W, py=(i*137.3+59)%(H*.93);
    const op=0.015+(i%13)*0.018;
    ctx.fillStyle=`rgba(210,220,255,${op})`;
    ctx.beginPath(); ctx.arc(px,py,.2+(i%5)*.18,0,Math.PI*2); ctx.fill();
  }

  // ── ANIMAL: protagonista a 82% opacidad ────────────────────────────────────
  try {
    const img = await loadAnimalImage(nft.constellation, nft.color, nft.c2);
    const pad = W * 0.05;
    ctx.save();
    ctx.globalAlpha = 0.82;
    ctx.drawImage(img, pad, pad, W - pad*2, H - pad*2);
    ctx.restore();
  } catch(e) { console.error('Animal error:', nft.nameES, e.message); }

  // ── Constelación: sutil sobre el animal ────────────────────────────────────
  const AREA_TOP=0.08, AREA_BOT=0.80, PAD_X=0.10;
  const stars = cData.stars.map(s=>({
    px:(PAD_X+s.x*(1-PAD_X*2))*W,
    py:AREA_TOP*H+s.y*(AREA_BOT-AREA_TOP)*H,
    r:s.r,
  }));

  // Líneas muy sutiles
  cData.lines.forEach(([a,b])=>{
    const sa=stars[a],sb=stars[b]; if(!sa||!sb) return;
    ctx.save();
    ctx.globalAlpha=0.25;
    ctx.strokeStyle=`rgba(${cr},${cg},${cb},0.5)`; ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(sa.px,sa.py);ctx.lineTo(sb.px,sb.py);ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=0.8;
    ctx.beginPath();ctx.moveTo(sa.px,sa.py);ctx.lineTo(sb.px,sb.py);ctx.stroke();
    ctx.restore();
  });

  // Nodos estrella sutiles
  ctx.save();
  ctx.globalAlpha=0.55;
  stars.forEach(s=>drawStarNode(ctx,s.px,s.py,s.r,cr,cg,cb));
  ctx.restore();

  // ── UI ─────────────────────────────────────────────────────────────────────
  const lg=()=>{const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(0.15,`rgba(${cr},${cg},${cb},0.55)`);g.addColorStop(0.85,`rgba(${cr},${cg},${cb},0.55)`);g.addColorStop(1,'rgba(0,0,0,0)');return g;};

  ctx.strokeStyle=lg(); ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(0,72);ctx.lineTo(W,72);ctx.stroke();

  ctx.fillStyle='rgba(255,255,255,0.90)'; ctx.font='bold 23px Georgia,serif'; ctx.textAlign='left'; ctx.textBaseline='middle';
  ctx.fillText('Om Domo',28,42);
  ctx.fillStyle=`rgba(${cr},${cg},${cb},0.70)`; ctx.font='11px sans-serif';
  ctx.textBaseline='middle'; ctx.fillText('NFT · AVALANCHE MAINNET',28,61);

  ctx.fillStyle=`rgba(${cr},${cg},${cb},0.12)`;
  roundRect(ctx,W-182,14,162,46,23); ctx.fill();
  ctx.strokeStyle=`rgba(${cr},${cg},${cb},0.55)`; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle=`rgba(${cr},${cg},${cb},1)`; ctx.font='bold 11px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('GENESIS · ERC-1155',W-101,31);
  ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.font='10px sans-serif';
  ctx.fillText(nft.element.toUpperCase(),W-101,51);

  ctx.strokeStyle=lg(); ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(0,H*.845);ctx.lineTo(W,H*.845);ctx.stroke();

  ctx.fillStyle=`rgba(${cr},${cg},${cb},0.35)`; ctx.font='italic 13px Georgia,serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(cData.label,W*.5,H*.868);

  // Nombre con glow
  const ng=ctx.createLinearGradient(28,0,520,0);
  ng.addColorStop(0,'#ffffff'); ng.addColorStop(.45,`rgba(${cr},${cg},${cb},0.95)`); ng.addColorStop(1,`rgba(${cr2},${cg2},${cb2},0.8)`);
  ctx.fillStyle=ng; ctx.shadowColor=`rgba(${cr},${cg},${cb},0.9)`; ctx.shadowBlur=22;
  ctx.font=`bold ${nft.nameES.length>8?50:60}px Georgia,serif`; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
  ctx.fillText(nft.nameES,28,H*.950); ctx.shadowBlur=0;

  // Símbolo con glow
  const sx=W-58, sy=H*.908;
  const sbg=ctx.createRadialGradient(sx,sy,0,sx,sy,50);
  sbg.addColorStop(0,`rgba(${cr},${cg},${cb},0.22)`); sbg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sbg; ctx.beginPath(); ctx.arc(sx,sy,50,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=`rgba(${cr},${cg},${cb},0.30)`; ctx.lineWidth=1;
  ctx.beginPath(); ctx.arc(sx,sy,38,0,Math.PI*2); ctx.stroke();
  ctx.save(); ctx.shadowColor=`rgba(${cr},${cg},${cb},1)`; ctx.shadowBlur=26;
  ctx.fillStyle='rgba(255,255,255,0.95)'; ctx.font='bold 42px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(nft.symbol,sx,sy); ctx.restore();

  ctx.fillStyle='rgba(255,255,255,0.12)'; ctx.font='11px monospace'; ctx.textAlign='right'; ctx.textBaseline='alphabetic';
  ctx.fillText(`#${nft.id} · web3.omdomo.com`,W-24,H-18);

  // Marco
  const fg=ctx.createLinearGradient(0,0,W,H);
  fg.addColorStop(0,`rgba(${cr},${cg},${cb},0.7)`); fg.addColorStop(.5,`rgba(${cr2},${cg2},${cb2},0.2)`); fg.addColorStop(1,`rgba(${cr},${cg},${cb},0.7)`);
  ctx.strokeStyle=fg; ctx.lineWidth=2.5; ctx.strokeRect(5,5,W-10,H-10);
  ctx.strokeStyle=`rgba(${cr},${cg},${cb},0.08)`; ctx.lineWidth=1; ctx.strokeRect(13,13,W-26,H-26);
  ctx.strokeStyle=`rgba(${cr},${cg},${cb},0.75)`; ctx.lineWidth=2;
  [[13,13],[W-13,13],[13,H-13],[W-13,H-13]].forEach(([cx,cy],i)=>{
    const dx=i%2===0?1:-1, dy=i<2?1:-1;
    ctx.beginPath(); ctx.moveTo(cx,cy+dy*32); ctx.lineTo(cx,cy); ctx.lineTo(cx+dx*32,cy); ctx.stroke();
  });
}

// ── Generar ────────────────────────────────────────────────────────────────────
const SIZE=1000;
(async () => {
  for (const nft of NFTs) {
    const canvas=createCanvas(SIZE,SIZE);
    await drawNFT(canvas.getContext('2d'),nft,SIZE,SIZE);
    const out=path.join(OUT_DIR,`${nft.id}.png`);
    fs.writeFileSync(out,canvas.toBuffer('image/png'));
    console.log(`✓ ${nft.id}.png — ${nft.nameES}`);
  }
  console.log(`\n✅ 13 imágenes generadas en public/nft-assets/`);
})();
