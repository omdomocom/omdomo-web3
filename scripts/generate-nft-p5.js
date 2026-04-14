#!/usr/bin/env node
/**
 * NFT Generator — p5.js via Puppeteer
 * Renderiza en Chrome headless con Perlin noise, curveVertex y HSB colors.
 */
const puppeteer = require('puppeteer');
const fs   = require('fs');
const path = require('path');

const OUT_DIR  = path.join(__dirname, '../public/nft-assets');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const P5_SRC = fs.readFileSync(
  path.join(__dirname, '../node_modules/p5/lib/p5.js'), 'utf8'
);

const NFTs = [
  { id:0,  nameES:'Génesis',     symbol:'✦', hue:45,  hue2:280, key:'genesis',     element:'Especial' },
  { id:1,  nameES:'Aries',       symbol:'♈', hue:190, hue2:290, key:'aries',        element:'Fuego'   },
  { id:2,  nameES:'Tauro',       symbol:'♉', hue:45,  hue2:168, key:'tauro',        element:'Tierra'  },
  { id:3,  nameES:'Géminis',     symbol:'♊', hue:46,  hue2:195, key:'geminis',      element:'Aire'    },
  { id:4,  nameES:'Cáncer',      symbol:'♋', hue:205, hue2:270, key:'cancer',       element:'Agua'    },
  { id:5,  nameES:'Leo',         symbol:'♌', hue:28,  hue2:46,  key:'leo',          element:'Fuego'   },
  { id:6,  nameES:'Virgo',       symbol:'♍', hue:240, hue2:200, key:'virgo',        element:'Tierra'  },
  { id:7,  nameES:'Libra',       symbol:'♎', hue:165, hue2:195, key:'libra',        element:'Aire'    },
  { id:8,  nameES:'Escorpio',    symbol:'♏', hue:300, hue2:270, key:'escorpio',     element:'Agua'    },
  { id:9,  nameES:'Sagitario',   symbol:'♐', hue:36,  hue2:16,  key:'sagitario',    element:'Fuego'   },
  { id:10, nameES:'Capricornio', symbol:'♑', hue:174, hue2:240, key:'capricornio',  element:'Tierra'  },
  { id:11, nameES:'Acuario',     symbol:'♒', hue:215, hue2:270, key:'acuario',      element:'Aire'    },
  { id:12, nameES:'Piscis',      symbol:'♓', hue:285, hue2:174, key:'piscis',       element:'Agua'    },
];

// ── Constelaciones ─────────────────────────────────────────────────────────────
const CONSTELLATIONS = {
  genesis:    { stars:[[.50,.28],[.72,.38],[.72,.62],[.50,.72],[.28,.62],[.28,.38],[.50,.50]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6]] },
  aries:      { stars:[[.20,.52],[.36,.38],[.52,.40],[.68,.34],[.82,.26]], lines:[[0,1],[1,2],[2,3],[3,4]] },
  tauro:      { stars:[[.18,.68],[.32,.54],[.50,.44],[.68,.54],[.82,.64],[.62,.26],[.76,.16]], lines:[[0,1],[1,2],[2,3],[3,4],[2,5],[5,6]] },
  geminis:    { stars:[[.34,.16],[.64,.16],[.32,.32],[.62,.32],[.30,.50],[.60,.50],[.34,.66],[.64,.64]], lines:[[0,2],[2,4],[4,6],[1,3],[3,5],[5,7],[4,5]] },
  cancer:     { stars:[[.26,.34],[.50,.26],[.74,.34],[.30,.64],[.50,.72],[.70,.64]], lines:[[0,1],[1,2],[0,3],[2,5],[3,4],[4,5]] },
  leo:        { stars:[[.18,.70],[.34,.54],[.48,.42],[.62,.30],[.76,.20],[.74,.46],[.64,.60]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[1,6]] },
  virgo:      { stars:[[.50,.14],[.66,.26],[.76,.42],[.50,.64],[.30,.56],[.22,.40]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]] },
  libra:      { stars:[[.28,.50],[.72,.50],[.50,.26],[.50,.66],[.18,.66],[.82,.66]], lines:[[0,1],[0,2],[1,2],[0,3],[1,3],[0,4],[1,5]] },
  escorpio:   { stars:[[.20,.20],[.32,.26],[.48,.30],[.64,.26],[.72,.40],[.68,.52],[.60,.62],[.52,.70],[.44,.78],[.36,.86]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9]] },
  sagitario:  { stars:[[.46,.18],[.62,.24],[.72,.36],[.66,.50],[.48,.58],[.30,.50],[.22,.36]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]] },
  capricornio:{ stars:[[.12,.42],[.28,.32],[.46,.28],[.64,.32],[.80,.42],[.78,.58],[.62,.70],[.28,.68]], lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0]] },
  acuario:    { stars:[[.14,.36],[.30,.32],[.50,.38],[.66,.30],[.86,.36],[.20,.60],[.36,.56],[.56,.62],[.74,.56],[.90,.62]], lines:[[0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[8,9]] },
  piscis:     { stars:[[.14,.48],[.24,.34],[.36,.28],[.46,.34],[.42,.52],[.86,.48],[.76,.34],[.62,.28],[.54,.34],[.58,.52]], lines:[[0,1],[1,2],[2,3],[3,4],[4,0],[5,6],[6,7],[7,8],[8,9],[9,5]] },
};

// ── HTML template p5 ───────────────────────────────────────────────────────────
function makeHTML(nft) {
  const con = CONSTELLATIONS[nft.key];
  const starsJSON = JSON.stringify(con.stars);
  const linesJSON = JSON.stringify(con.lines);

  return `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<style>*{margin:0;padding:0;overflow:hidden;}canvas{display:block;}</style>
</head><body>
<script>${P5_SRC}</script>
<script>
const W=1000,H=1000;
const HUE=${nft.hue}, HUE2=${nft.hue2};
const KEY='${nft.key}';
const SYM='${nft.symbol}';
const NAME='${nft.nameES}';
const ID=${nft.id};
const EL='${nft.element}';
const STARS=${starsJSON};
const LINES=${linesJSON};

let pg;

function setup(){
  createCanvas(W,H);
  colorMode(HSB,360,100,100,100);
  randomSeed(ID*1337+7);
  noiseSeed(ID*42+13);
  pixelDensity(1);
  noLoop();
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function glow(col, blur=20){
  drawingContext.shadowBlur=blur;
  drawingContext.shadowColor=col;
}
function noGlow(){ drawingContext.shadowBlur=0; }

function drawEye(ex,ey,r,h){
  noStroke();
  glow(\`hsla(\${h},90%,70%,0.9)\`,18);
  fill(h,40,20,90); ellipse(ex,ey,r*2.4,r*2);
  fill(10,0,5,100); ellipse(ex,ey,r*2,r*1.6);
  fill(h,85,90,100); ellipse(ex,ey,r*1.3,r*1.1);
  fill(h,50,100,100); ellipse(ex-r*.3,ey-r*.35,r*.5,r*.4);
  fill(255,0,100,80); ellipse(ex+r*.15,ey+r*.1,r*.22,r*.18);
  noGlow();
}

function hsl(h,s,l){ return \`hsl(\${h},\${s}%,\${l}%)\`; }

// ── Fondo galaxia con Perlin noise ────────────────────────────────────────────
function drawBackground(){
  background(270,88,5);

  // Nebula layers — grid grueso para velocidad
  noStroke();
  const STEP=18;
  for(let y=0;y<H;y+=STEP){
    for(let x=0;x<W;x+=STEP){
      const n =noise(x*.004,y*.004);
      const n2=noise(x*.009+40,y*.009+40);
      if(n>0.42){
        const h=lerp(HUE-20,HUE+20,n2);
        const s=map(n,0.42,1,18,72);
        const b=map(n,0.42,1,5,30);
        fill(h,s,b,map(n,0.42,1,12,48));
        rect(x,y,STEP+1,STEP+1);
      }
    }
  }
  // Segunda capa de nebula con blur natural
  drawingContext.filter='blur(22px)';
  for(let i=0;i<12;i++){
    const nx=random(W),ny=random(H*.88);
    const nr=random(80,200);
    fill(i%2===0?HUE:HUE2,map(random(),0,1,40,80),map(random(),0,1,15,35),map(random(),0,1,20,50));
    circle(nx,ny,nr*2);
  }
  drawingContext.filter='none';

  // Stars
  for(let i=0;i<320;i++){
    const x=random(W),y=random(H*.9);
    const s=random(0.6,2.8);
    const tw=random(60,100);
    fill(map(random(),0,1,200,280),map(random(),0,1,5,20),100,tw);
    noStroke();
    circle(x,y,s);
    if(s>1.8){ // bright star cross
      stroke(220,10,100,30);strokeWeight(0.5);
      line(x-s*3,y,x+s*3,y); line(x,y-s*3,x,y+s*3);
      noStroke();
    }
  }

  // Central radial glow
  drawingContext.save();
  const grad=drawingContext.createRadialGradient(W/2,H*.44,0,W/2,H*.44,520);
  grad.addColorStop(0,hsl(HUE,75,30)+'33');
  grad.addColorStop(0.5,hsl(HUE2,60,20)+'18');
  grad.addColorStop(1,'transparent');
  drawingContext.fillStyle=grad;
  drawingContext.fillRect(0,0,W,H);
  drawingContext.restore();
}

// ── Animales ──────────────────────────────────────────────────────────────────
function drawAnimal(){
  push();
  if(KEY==='genesis')    drawGenesis();
  else if(KEY==='aries') drawAries();
  else if(KEY==='tauro') drawTauro();
  else if(KEY==='geminis') drawGeminis();
  else if(KEY==='cancer') drawCancer();
  else if(KEY==='leo')   drawLeo();
  else if(KEY==='virgo') drawVirgo();
  else if(KEY==='libra') drawLibra();
  else if(KEY==='escorpio') drawEscorpio();
  else if(KEY==='sagitario') drawSagitario();
  else if(KEY==='capricornio') drawCapricornio();
  else if(KEY==='acuario') drawAcuario();
  else if(KEY==='piscis') drawPiscis();
  pop();
}

// ── GENESIS: Flor de la Vida ─────────────────────────────────────────────────
function drawGenesis(){
  const cx=W/2,cy=H/2-20;
  const R=80;
  stroke(HUE,90,90,65); strokeWeight(1.5); noFill();
  glow(hsl(HUE,90,70),20);

  // Flower of Life rings
  for(let i=0;i<7;i++){
    const a=i===0?0:((i-1)*PI/3);
    const ox=i===0?0:R*cos(a), oy=i===0?0:R*sin(a);
    circle(cx+ox,cy+oy,R*2);
  }
  for(let i=0;i<6;i++){
    const a=i*PI/3+PI/6;
    circle(cx+R*2*cos(a),cy+R*2*sin(a),R*2);
  }

  // Hexagram
  stroke(HUE2,95,100,90); strokeWeight(2.5);
  glow(hsl(HUE2,90,70),25);
  for(let t=0;t<2;t++){
    beginShape();
    for(let i=0;i<3;i++){
      const a=i*TWO_PI/3+(t?PI/6:PI*5/6);
      vertex(cx+140*cos(a),cy+140*sin(a));
    }
    endShape(CLOSE);
  }

  // Outer ring dots
  for(let i=0;i<12;i++){
    const a=i*TWO_PI/12;
    fill(i%2===0?HUE:HUE2,90,100,80);
    noStroke();
    glow(hsl(HUE,90,70),15);
    circle(cx+170*cos(a),cy+170*sin(a),10);
  }

  // Center symbol
  noStroke(); glow(hsl(HUE,90,80),35);
  fill(HUE,60,100,95);
  textAlign(CENTER,CENTER); textFont('serif'); textSize(80);
  text('✦',cx,cy+4);
  noGlow();
}

// ── ARIES: Carnero con cuernos fibonacci ─────────────────────────────────────
function drawAries(){
  const cx=W/2,cy=H/2;
  const hc=color(HUE,90,90,90), hc2=color(HUE2,85,85,80);

  function spiralHorn(sx,sy,dir){
    stroke(lerpColor(hc,hc2,0.3)); strokeWeight(8); noFill();
    glow(hsl(HUE,90,70),22);
    let r=2,a=dir>0?-PI/4:PI+PI/4,cx2=sx,cy2=sy;
    beginShape();
    for(let i=0;i<180;i++){
      r+=0.55;
      a+=dir*0.072;
      const x=cx2+r*cos(a), y=cy2+r*sin(a);
      curveVertex(x,y);
      if(i===0){cx2=x;cy2=y;}
    }
    endShape();
    // inner spiral highlight
    stroke(HUE,50,100,60); strokeWeight(2.5);
    r=2;a=dir>0?-PI/4:PI+PI/4;cx2=sx;cy2=sy;
    beginShape();
    for(let i=0;i<180;i++){
      r+=0.55; a+=dir*0.072;
      curveVertex(cx2+r*cos(a),cy2+r*sin(a));
      if(i===0){cx2=cx2+r*cos(a);cy2=cy2+r*sin(a);}
    }
    endShape();
    noGlow();
  }

  spiralHorn(cx-68, cy-35, -1);
  spiralHorn(cx+68, cy-35,  1);

  // Fleece body
  noStroke();
  for(let i=0;i<28;i++){
    const a=i*TWO_PI/28;
    const r=55+noise(cos(a)*2+20,sin(a)*2+20)*35;
    const x=cx+r*cos(a), y=cy+55+r*sin(a)*.65;
    glow(hsl(HUE,90,70),12);
    fill(HUE,70,70,55);
    circle(x,y,22+noise(i*.3,5)*16);
  }

  // Head
  fill(HUE2,60,80,88); noStroke();
  glow(hsl(HUE2,80,60),15);
  ellipse(cx,cy,108,100);

  // Snout
  fill(HUE2,65,65,80);
  ellipse(cx,cy+28,55,38);
  fill(HUE2,80,30,90);
  ellipse(cx-12,cy+30,14,10);
  ellipse(cx+12,cy+30,14,10);

  // Forehead gem
  fill(HUE,90,100,90); glow(hsl(HUE,90,80),22);
  beginShape();
  vertex(cx,cy-45); vertex(cx+14,cy-28); vertex(cx,cy-12); vertex(cx-14,cy-28);
  endShape(CLOSE);

  drawEye(cx-28,cy-8,13,HUE);
  drawEye(cx+28,cy-8,13,HUE);
  noGlow();
}

// ── TAURO: Toro con mandala en la frente ─────────────────────────────────────
function drawTauro(){
  const cx=W/2,cy=H/2+10;

  // Cuernos
  stroke(HUE,90,90,90); strokeWeight(10); noFill();
  glow(hsl(HUE,90,70),25);
  beginShape();
  curveVertex(cx-50,cy-60);
  curveVertex(cx-50,cy-60);
  curveVertex(cx-95,cy-95);
  curveVertex(cx-140,cy-55);
  curveVertex(cx-125,cy-15);
  curveVertex(cx-125,cy-15);
  endShape();
  beginShape();
  curveVertex(cx+50,cy-60);
  curveVertex(cx+50,cy-60);
  curveVertex(cx+95,cy-95);
  curveVertex(cx+140,cy-55);
  curveVertex(cx+125,cy-15);
  curveVertex(cx+125,cy-15);
  endShape();
  // Horn tips
  fill(HUE,90,100,90); noStroke();
  circle(cx-125,cy-15,14); circle(cx+125,cy-15,14);

  // Cara
  noStroke(); fill(HUE2,55,75,85);
  glow(hsl(HUE2,70,55),18);
  ellipse(cx,cy+10,170,160);
  fill(HUE2,60,65,80);
  ellipse(cx,cy+28,120,90);

  // Frente mandala
  stroke(HUE,85,100,75); strokeWeight(1.5); noFill();
  glow(hsl(HUE,90,80),15);
  for(let i=0;i<5;i++) circle(cx,cy-35,18+i*16);
  for(let j=0;j<6;j++){
    const a=j*PI/3;
    line(cx,cy-35,cx+36*cos(a),cy-35+36*sin(a));
  }

  // Ring
  fill(HUE,90,100,80); noStroke();
  glow(hsl(HUE,90,80),20);
  ellipse(cx,cy+48,28,14);
  fill(HUE2,60,30,90); ellipse(cx,cy+48,12,6);

  drawEye(cx-42,cy+2,15,HUE2);
  drawEye(cx+42,cy+2,15,HUE2);

  // Texturas de pelaje
  stroke(HUE2,60,85,40); strokeWeight(1.2); noFill();
  for(let i=0;i<12;i++){
    const x=cx+random(-70,70),y=cy+random(-20,60);
    const n=noise(x*.01,y*.01);
    beginShape();
    curveVertex(x,y); curveVertex(x+n*12-6,y-8);
    curveVertex(x+n*18-9,y-18); curveVertex(x+n*8-4,y-24);
    endShape();
  }
  noGlow();
}

// ── GÉMINIS: Gemelos cósmicos ─────────────────────────────────────────────────
function drawGeminis(){
  const cx=W/2,cy=H/2;

  function drawTwin(ox,mirror){
    push(); translate(cx+ox,cy); if(mirror) scale(-1,1);

    // Cuerpo/túnica
    noStroke(); fill(HUE2,55,60,75);
    glow(hsl(HUE2,70,55),15);
    beginShape();
    curveVertex(-35,30);curveVertex(-35,30);
    curveVertex(-50,80);curveVertex(-45,130);
    curveVertex(0,145);curveVertex(45,130);
    curveVertex(50,80);curveVertex(35,30);
    curveVertex(35,30);
    endShape(CLOSE);

    // Lira / instrumento
    stroke(HUE,85,90,80); strokeWeight(2); noFill();
    glow(hsl(HUE,90,75),12);
    ellipse(22,75,22,32);
    line(11,60,11,92); line(33,60,33,92);
    for(let s=0;s<5;s++) line(11,65+s*6,33,65+s*6);

    // Cabeza
    noStroke(); fill(HUE2,40,82,90);
    glow(hsl(HUE2,60,65),18);
    ellipse(0,-38,68,72);

    // Cabello
    stroke(HUE,80,85,80); strokeWeight(3.5); noFill();
    glow(hsl(HUE,90,70),12);
    for(let s=0;s<8;s++){
      const a=(s-3.5)*.18;
      beginShape();
      curveVertex(-34+s*2,-38);curveVertex(-34+s*2,-38);
      curveVertex(-40+s*3,-60);curveVertex(-30+s*8,-80);
      curveVertex(-10+s*10,-95);
      endShape();
    }

    // Corona
    fill(HUE,90,100,85); noStroke(); glow(hsl(HUE,90,80),18);
    for(let p=0;p<5;p++){
      const px=-20+p*10,ph=-72-((p===2)?18:p%2===0?12:6);
      triangle(px-4,-72,px+4,-72,px,ph);
    }

    drawEye(-14,-42,11,HUE2);
    drawEye(14,-42,11,HUE2);
    pop();
  }

  drawTwin(-110,false);
  drawTwin(110,true);

  // Conexión áurea
  stroke(HUE,90,100,60); strokeWeight(2);
  glow(hsl(HUE,90,80),20);
  for(let t=0;t<=1;t+=0.05){
    const x=lerp(cx-75,cx+75,t);
    const y=cy-30+sin(t*PI)*(-40);
    fill(HUE,90,100,map(sin(t*PI),0,1,20,80));
    noStroke(); circle(x,y,map(sin(t*PI),0,1,2,7));
  }
  noGlow();
}

// ── CÁNCER: Cangrejo cósmico ──────────────────────────────────────────────────
function drawCancer(){
  const cx=W/2,cy=H/2+10;

  function drawClaw(side){
    const sx=cx+side*72,sy=cy-5;
    stroke(HUE,85,85,85); strokeWeight(6); noFill();
    glow(hsl(HUE,90,70),20);
    // Brazo
    beginShape();
    curveVertex(cx+side*40,cy);curveVertex(cx+side*40,cy);
    curveVertex(sx+side*15,sy-20);
    curveVertex(sx+side*25,sy-10);
    curveVertex(sx,sy);
    curveVertex(sx,sy);
    endShape();
    // Pinza superior
    stroke(HUE,85,90,85); strokeWeight(5);
    beginShape();
    curveVertex(sx,sy);curveVertex(sx,sy);
    curveVertex(sx+side*28,sy-32);
    curveVertex(sx+side*42,sy-20);
    curveVertex(sx+side*32,sy);
    curveVertex(sx+side*32,sy);
    endShape();
    // Pinza inferior
    beginShape();
    curveVertex(sx,sy);curveVertex(sx,sy);
    curveVertex(sx+side*30,sy+22);
    curveVertex(sx+side*42,sy+10);
    curveVertex(sx+side*32,sy);
    curveVertex(sx+side*32,sy);
    endShape();
    // Tip glow
    fill(HUE,90,100,85); noStroke();
    circle(sx+side*42,sy-5,12);
  }

  drawClaw(-1); drawClaw(1);

  // Caparazón con capas concéntricas
  noStroke(); fill(HUE,70,60,80);
  glow(hsl(HUE,90,60),22);
  ellipse(cx,cy,145,115);
  stroke(HUE,90,90,55); strokeWeight(1.5); noFill();
  for(let r=20;r<=65;r+=15) ellipse(cx,cy,r*2.25,r*1.8);

  // Patas
  stroke(HUE,80,80,70); strokeWeight(3.5); noFill();
  for(let i=0;i<4;i++){
    const side=i<2?-1:1;
    const yOff=[20,45][i%2];
    line(cx+side*65,cy+yOff-10,cx+side*115,cy+yOff+20);
    line(cx+side*115,cy+yOff+20,cx+side*118,cy+yOff+42);
  }

  // Ojos en pedúnculo
  stroke(HUE,80,85,75); strokeWeight(2.5);
  line(cx-18,cy-55,cx-22,cy-80);
  line(cx+18,cy-55,cx+22,cy-80);
  drawEye(cx-22,cy-80,11,HUE);
  drawEye(cx+22,cy-80,11,HUE);

  // Boca
  noFill(); stroke(HUE2,70,80,60); strokeWeight(2);
  arc(cx,cy+12,40,20,0,PI);
  noGlow();
}

// ── LEO: León con melena de fuego ────────────────────────────────────────────
function drawLeo(){
  const cx=W/2,cy=H/2+15;
  const c1=color(HUE,90,90,90), c2=color(HUE2,85,95,80);

  // Melena — 48 rayos con Perlin noise
  noStroke();
  for(let i=0;i<48;i++){
    const a=i*TWO_PI/48-PI*.5;
    const n=noise(cos(a)*2.5+15,sin(a)*2.5+15);
    const r1=88, r2=165+n*90;
    const w=map(n,0,1,5,18);
    const col=lerpColor(c1,c2,n);

    glow(hsl(HUE,90,65),25);
    stroke(col); strokeWeight(w); strokeCap(ROUND);
    const ax=cx+r1*cos(a), ay=cy+r1*sin(a);
    const bx=cx+r2*cos(a), by=cy+r2*sin(a);
    const mx=cx+(r1+r2)*.5*cos(a)+noise(i*.3,0)*30-15;
    const my=cy+(r1+r2)*.5*sin(a)+noise(i*.3,1)*30-15;
    beginShape();
    curveVertex(ax,ay);curveVertex(ax,ay);
    curveVertex(mx,my);curveVertex(bx,by);curveVertex(bx,by);
    endShape();
  }

  // Cara base
  noStroke(); fill(HUE,75,58,92);
  glow(hsl(HUE,70,50),20);
  ellipse(cx,cy,190,178);
  fill(HUE,80,50,85); ellipse(cx,cy+22,130,95);
  fill(HUE2,70,75,75); ellipse(cx-52,cy-12,42,32);
  fill(HUE2,70,75,75); ellipse(cx+52,cy-12,42,32);

  // Frente
  fill(HUE2,90,100,85); glow(hsl(HUE2,90,80),22);
  beginShape();
  vertex(cx,cy-88);vertex(cx+18,cy-62);vertex(cx,cy-38);vertex(cx-18,cy-62);
  endShape(CLOSE);

  // Patrones en mejillas
  stroke(HUE2,70,85,45); strokeWeight(1.2); noFill();
  for(let d=0;d<4;d++){
    const px=cx-60+d*40,py=cy+28;
    arc(px,py,20,20,PI,TWO_PI);
  }

  // Nariz
  fill(HUE,85,45,90); noStroke();
  triangle(cx-16,cy+28,cx+16,cy+28,cx,cy+50);
  // Boca
  stroke(HUE,80,35,80); strokeWeight(2.5); noFill();
  arc(cx-14,cy+52,24,18,0,PI*.9);
  arc(cx+14,cy+52,24,18,PI*.1,PI);

  // Bigote puntos
  fill(HUE2,40,100,70); noStroke();
  [-55,-38,-21,21,38,55].forEach(dx=>{
    circle(cx+dx,cy+40,5);
  });

  drawEye(cx-48,cy-5,17,HUE);
  drawEye(cx+48,cy-5,17,HUE);
  noGlow();
}

// ── VIRGO: Diosa de la aurora ─────────────────────────────────────────────────
function drawVirgo(){
  const cx=W/2,cy=H/2+20;

  // Cabello aurora — streams con noise
  for(let s=0;s<22;s++){
    const side=s<11?-1:1;
    const idx=s%11;
    stroke(lerpColor(color(HUE,85,90,70),color(HUE2,75,80,50),idx/10));
    strokeWeight(map(idx,0,10,4,1.5)); noFill();
    glow(hsl(HUE,80,70),12);
    beginShape();
    let hx=cx+side*18, hy=cy-68;
    curveVertex(hx,hy);curveVertex(hx,hy);
    for(let t=0;t<8;t++){
      const n=noise(s*.4,t*.3+20);
      hx+=side*(18+n*25);
      hy+=20+n*12;
      curveVertex(hx,hy);
    }
    curveVertex(hx,hy);
    endShape();
  }

  // Vestido/cuerpo
  noStroke(); fill(HUE,60,65,80);
  glow(hsl(HUE,80,60),18);
  beginShape();
  curveVertex(cx-42,cy-10);curveVertex(cx-42,cy-10);
  curveVertex(cx-55,cy+40);curveVertex(cx-62,cy+100);
  curveVertex(cx-45,cy+155);curveVertex(cx,cy+165);
  curveVertex(cx+45,cy+155);curveVertex(cx+62,cy+100);
  curveVertex(cx+55,cy+40);curveVertex(cx+42,cy-10);
  curveVertex(cx+42,cy-10);
  endShape(CLOSE);

  // Faja decorativa
  stroke(HUE2,90,100,75); strokeWeight(2); noFill();
  glow(hsl(HUE2,90,80),15);
  for(let t=0;t<=1;t+=0.04){
    const x=lerp(cx-50,cx+50,t);
    const y=cy+42+sin(t*PI*5)*5;
    fill(HUE2,90,100,70); noStroke();
    circle(x,y,4);
  }

  // Cabeza
  noStroke(); fill(HUE2,35,85,88);
  glow(hsl(HUE2,60,70),18);
  ellipse(cx,cy-62,76,82);

  // Espiga de trigo
  stroke(HUE2,90,85,80); strokeWeight(2.5); noFill();
  glow(hsl(HUE2,85,75),15);
  line(cx+68,cy-48,cx+100,cy+55);
  for(let g=0;g<7;g++){
    const gx=cx+70+g*4.5, gy=cy-42+g*14;
    ellipse(gx+12,gy-6,20,10);
    ellipse(gx+6,gy+2,20,10);
  }

  drawEye(cx-16,cy-66,12,HUE2);
  drawEye(cx+16,cy-66,12,HUE2);

  // Labios
  noFill(); stroke(HUE,70,80,70); strokeWeight(2);
  arc(cx,cy-34,28,14,0,PI);
  noGlow();
}

// ── LIBRA: Balanza cósmica ────────────────────────────────────────────────────
function drawLibra(){
  const cx=W/2,cy=H/2-10;

  // Poste central con decoración
  stroke(HUE2,85,90,85); strokeWeight(5);
  glow(hsl(HUE2,90,75),20);
  line(cx,cy-160,cx,cy+130);

  // Ornamento superior
  fill(HUE,90,100,90); noStroke(); glow(hsl(HUE,90,85),25);
  star(cx,cy-160,10,20,6);

  // Barra de la balanza
  stroke(HUE,85,90,85); strokeWeight(6); noFill();
  glow(hsl(HUE,90,75),22);
  line(cx-170,cy-70,cx+170,cy-70);

  // Cadenas
  stroke(HUE2,70,80,65); strokeWeight(2);
  for(let y=cy-70;y<cy-15;y+=10){
    ellipse(cx-160,y+5,8,10);
    ellipse(cx+160,y+5,8,10);
  }

  // Platillo izquierdo — Luna
  fill(HUE2,60,75,80); noStroke();
  glow(hsl(HUE2,80,60),25);
  ellipse(cx-160,cy-8,100,30);
  fill(HUE2,50,90,85);
  ellipse(cx-160,cy-8,85,22);
  // Luna creciente
  fill(HUE2,80,95,90); noStroke();
  glow(hsl(HUE2,90,80),20);
  arc(cx-180,cy-50,50,50,PI*.8,PI*2.2);
  fill(270,80,10,90);
  arc(cx-172,cy-50,40,40,PI*.8,PI*2.2);

  // Platillo derecho — Sol
  fill(HUE,60,75,80); noStroke();
  glow(hsl(HUE,80,60),25);
  ellipse(cx+160,cy+8,100,30);
  fill(HUE,50,90,85);
  ellipse(cx+160,cy+8,85,22);
  // Sol
  fill(HUE2,90,100,90); glow(hsl(HUE2,90,85),25);
  for(let r=0;r<8;r++){
    const ra=r*PI/4;
    line(cx+160+26*cos(ra),cy-48+26*sin(ra),cx+160+38*cos(ra),cy-48+38*sin(ra));
  }
  stroke(HUE2,90,100,80); strokeWeight(3);
  fill(HUE2,85,100,85); circle(cx+160,cy-48,30);

  // Base
  fill(HUE,70,80,75); noStroke();
  glow(hsl(HUE,80,65),18);
  ellipse(cx,cy+130,90,22);
  rect(cx-8,cy+30,16,100);
  noGlow();
}

function star(x,y,r1,r2,pts){
  beginShape();
  for(let i=0;i<pts*2;i++){
    const r=i%2===0?r2:r1;
    const a=i*PI/pts-PI/2;
    vertex(x+r*cos(a),y+r*sin(a));
  }
  endShape(CLOSE);
}

// ── ESCORPIO: Escorpión con cola neon ────────────────────────────────────────
function drawEscorpio(){
  const cx=W/2,cy=H/2;

  // Cuerpo segmentado
  const segs=[
    {x:cx,y:cy-40,r:36},{x:cx,y:cy,r:32},{x:cx,y:cy+38,r:28},
    {x:cx,y:cy+72,r:24},{x:cx,y:cy+104,r:20},{x:cx,y:cy+132,r:16}
  ];
  segs.forEach((s,i)=>{
    fill(HUE,85,map(i,0,5,80,55),90-i*5);
    noStroke(); glow(hsl(HUE,90,65),18);
    ellipse(s.x,s.y,s.r*2.4,s.r*1.8);
    // Línea segmento
    if(i<segs.length-1){
      stroke(HUE,70,90,50); strokeWeight(1); noFill();
      line(s.x-s.r*.9,s.y+s.r*.5,s.x+s.r*.9,s.y+s.r*.5);
    }
  });

  // Cola en curva
  stroke(HUE,90,90,85); strokeWeight(10); noFill();
  glow(hsl(HUE,90,70),25);
  beginShape();
  curveVertex(cx,cy+132);curveVertex(cx,cy+132);
  curveVertex(cx+40,cy+158);
  curveVertex(cx+90,cy+148);
  curveVertex(cx+110,cy+110);
  curveVertex(cx+88,cy+68);
  curveVertex(cx+60,cy+52);
  curveVertex(cx+60,cy+52);
  endShape();
  // Aguijón
  fill(HUE2,90,100,95); noStroke(); glow(hsl(HUE2,90,80),25);
  triangle(cx+60,cy+30,cx+50,cy+55,cx+70,cy+55);

  // Pinzas
  function drawPincer(side){
    stroke(HUE,85,85,85); strokeWeight(7); noFill();
    glow(hsl(HUE,90,70),20);
    beginShape();
    curveVertex(cx+side*34,cy-40);curveVertex(cx+side*34,cy-40);
    curveVertex(cx+side*68,cy-60);curveVertex(cx+side*105,cy-40);
    curveVertex(cx+side*105,cy-40);
    endShape();
    // Doble pinza
    stroke(HUE,80,90,80); strokeWeight(5);
    beginShape();
    curveVertex(cx+side*105,cy-40);curveVertex(cx+side*105,cy-40);
    curveVertex(cx+side*130,cy-60);curveVertex(cx+side*135,cy-45);
    curveVertex(cx+side*135,cy-45);
    endShape();
    beginShape();
    curveVertex(cx+side*105,cy-40);curveVertex(cx+side*105,cy-40);
    curveVertex(cx+side*125,cy-22);curveVertex(cx+side*130,cy-38);
    curveVertex(cx+side*130,cy-38);
    endShape();
    fill(HUE,90,100,85); noStroke(); circle(cx+side*132,cy-45,11);
  }
  drawPincer(-1); drawPincer(1);

  // Cabeza
  noStroke(); fill(HUE,80,72,92);
  glow(hsl(HUE,90,65),18);
  ellipse(cx,cy-70,72,58);
  drawEye(cx-18,cy-72,11,HUE);
  drawEye(cx+18,cy-72,11,HUE);
  noGlow();
}

// ── SAGITARIO: La Flecha cósmica ─────────────────────────────────────────────
function drawSagitario(){
  const cx=W/2,cy=H/2;

  // Arco
  stroke(HUE,85,85,85); strokeWeight(7); noFill();
  glow(hsl(HUE,90,70),25);
  beginShape();
  curveVertex(cx-185,cy-135);curveVertex(cx-185,cy-135);
  curveVertex(cx-90,cy-50);
  curveVertex(cx-40,cy+80);
  curveVertex(cx-10,cy+175);
  curveVertex(cx-10,cy+175);
  endShape();
  // Cuerda
  stroke(HUE2,80,90,70); strokeWeight(2.5);
  line(cx-185,cy-135,cx-10,cy+175);

  // Flecha — diagonal principal
  stroke(HUE2,90,100,92); strokeWeight(8); noFill();
  glow(hsl(HUE2,90,80),28);
  line(cx-128,cy+118,cx+155,cy-138);
  // Detalles del astil
  stroke(HUE,70,90,60); strokeWeight(2);
  for(let t=0.2;t<0.8;t+=0.15){
    const x=lerp(cx-128,cx+155,t);
    const y=lerp(cx+118,cy-138,t);
    line(x-8,y-8,x+8,y+8);
  }

  // Punta de flecha
  fill(HUE2,90,100,95); noStroke();
  glow(hsl(HUE2,90,85),30);
  push(); translate(cx+155,cy-138); rotate(-PI/4);
  triangle(0,-22,12,12,-12,12);
  pop();

  // Plumas del extremo
  for(let f=0;f<3;f++){
    stroke(HUE,85,90,80-f*15); strokeWeight(3-f*.5); noFill();
    glow(hsl(HUE,80,70),12);
    const fx=cx-128, fy=cy+118;
    beginShape();
    curveVertex(fx,fy);curveVertex(fx,fy);
    curveVertex(fx-18+f*6,fy+22);curveVertex(fx-12+f*4,fy+40);
    curveVertex(fx-12+f*4,fy+40);
    endShape();
  }

  // Estrellas alrededor
  [color(HUE,90,100),color(HUE2,90,100)].forEach((c,ci)=>{
    fill(c); noStroke(); glow(hsl(ci===0?HUE:HUE2,90,80),20);
    const positions=[[cx+80,cy-80,12],[cx-60,cy+90,10],[cx+20,cy+30,8],[cx-100,cy-80,8],[cx+130,cy+40,7]];
    positions.forEach(([px,py,pr])=>star(px,py,pr*.4,pr,5));
  });
  noGlow();
}

// ── CAPRICORNIO: Cabra marina ─────────────────────────────────────────────────
function drawCapricornio(){
  const cx=W/2,cy=H/2;

  // Cola de pez — ondulante
  stroke(HUE2,85,85,80); strokeWeight(6); noFill();
  glow(hsl(HUE2,90,70),22);
  beginShape();
  curveVertex(cx-30,cy+30);curveVertex(cx-30,cy+30);
  curveVertex(cx-50,cy+80);curveVertex(cx-30,cy+130);
  curveVertex(cx+10,cy+155);curveVertex(cx+55,cy+145);
  curveVertex(cx+72,cy+115);curveVertex(cx+55,cy+80);
  curveVertex(cx+55,cy+80);
  endShape();
  // Aleta de cola
  stroke(HUE2,80,90,75); strokeWeight(5);
  beginShape();
  curveVertex(cx+50,cy+145);curveVertex(cx+50,cy+145);
  curveVertex(cx+75,cy+165);curveVertex(cx+95,cy+150);
  curveVertex(cx+80,cy+130);curveVertex(cx+80,cy+130);
  endShape();
  beginShape();
  curveVertex(cx+50,cy+145);curveVertex(cx+50,cy+145);
  curveVertex(cx+65,cy+170);curveVertex(cx+85,cy+168);
  curveVertex(cx+80,cy+148);curveVertex(cx+80,cy+148);
  endShape();
  // Escamas (pequeños arcos)
  stroke(HUE2,70,90,50); strokeWeight(1.5); noFill();
  for(let s=0;s<12;s++){
    const t=s/12;
    const sx=lerp(cx-30,cx+55,t);
    const sy=lerp(cy+40,cy+125,t);
    arc(sx,sy,20,14,0,PI);
  }

  // Cuernos retorcidos
  stroke(HUE,90,85,85); strokeWeight(7); noFill();
  glow(hsl(HUE,90,70),22);
  // Cuerno izquierdo
  beginShape();
  curveVertex(cx-42,cy-68);curveVertex(cx-42,cy-68);
  curveVertex(cx-68,cy-105);curveVertex(cx-52,cy-145);
  curveVertex(cx-28,cy-138);curveVertex(cx-28,cy-138);
  endShape();
  // Cuerno derecho — curvado hacia atrás
  beginShape();
  curveVertex(cx+30,cy-72);curveVertex(cx+30,cy-72);
  curveVertex(cx+65,cy-105);curveVertex(cx+80,cy-88);
  curveVertex(cx+72,cy-62);curveVertex(cx+72,cy-62);
  endShape();

  // Cara de cabra
  noStroke(); fill(HUE,55,75,88);
  glow(hsl(HUE,70,55),18);
  ellipse(cx-5,cy-38,95,108);
  // Hocico
  fill(HUE,60,65,80); ellipse(cx,cy+22,55,40);
  // Barba
  stroke(HUE2,60,80,65); strokeWeight(2.5); noFill();
  beginShape();
  curveVertex(cx-12,cy+42);curveVertex(cx-12,cy+42);
  curveVertex(cx-8,cy+65);curveVertex(cx,cy+72);
  curveVertex(cx+8,cy+65);curveVertex(cx+12,cy+42);
  curveVertex(cx+12,cy+42);
  endShape();
  // Gem frontal
  fill(HUE2,90,100,88); noStroke(); glow(hsl(HUE2,90,80),20);
  star(cx-5,cy-72,8,14,6);

  drawEye(cx-26,cy-40,13,HUE);
  drawEye(cx+22,cy-40,13,HUE);
  noGlow();
}

// ── ACUARIO: Ondas estelares ──────────────────────────────────────────────────
function drawAcuario(){
  const cx=W/2,cy=H/2;

  // Figura del aguador — abstracta
  stroke(HUE2,75,80,75); strokeWeight(4); noFill();
  glow(hsl(HUE2,80,65),18);
  // Cuerpo
  beginShape();
  curveVertex(cx-45,cy-155);curveVertex(cx-45,cy-155);
  curveVertex(cx-55,cy-100);curveVertex(cx-48,cy-30);
  curveVertex(cx-40,cy+20);curveVertex(cx-40,cy+20);
  endShape();
  beginShape();
  curveVertex(cx+35,cy-155);curveVertex(cx+35,cy-155);
  curveVertex(cx+45,cy-100);curveVertex(cx+38,cy-30);
  curveVertex(cx+30,cy+20);curveVertex(cx+30,cy+20);
  endShape();
  // Cabeza
  noStroke(); fill(HUE2,50,80,85);
  glow(hsl(HUE2,70,65),18);
  ellipse(cx-5,cy-165,65,68);
  drawEye(cx-20,cy-168,11,HUE2);
  drawEye(cx+12,cy-168,11,HUE2);

  // Urna/vasija
  fill(HUE,70,75,80); noStroke(); glow(hsl(HUE,80,60),20);
  beginShape();
  curveVertex(cx-22,cy+18);curveVertex(cx-22,cy+18);
  curveVertex(cx-32,cy+45);curveVertex(cx-28,cy+72);
  curveVertex(cx-10,cy+82);curveVertex(cx+10,cy+82);
  curveVertex(cx+28,cy+72);curveVertex(cx+32,cy+45);
  curveVertex(cx+22,cy+18);curveVertex(cx+22,cy+18);
  endShape(CLOSE);
  // Boca urna
  fill(HUE,80,85,90); ellipse(cx,cy+18,52,18);

  // Ondas de agua con Perlin noise
  for(let w=0;w<4;w++){
    const baseY=cy+95+w*40;
    const alpha=map(w,0,3,85,30);
    const h=w%2===0?HUE:HUE2;
    stroke(h,85,90,alpha); strokeWeight(3.5-w*.5); noFill();
    glow(hsl(h,85,75),16);
    beginShape();
    for(let x=cx-160;x<=cx+160;x+=8){
      const n=noise(x*.006+w*20,w*.5);
      const y=baseY+sin(x*.025+w)*22+n*18-9;
      curveVertex(x,y);
    }
    endShape();
    // Puntos en las crestas
    for(let d=0;d<8;d++){
      const dx=cx-140+d*40;
      const n=noise(dx*.006+w*20,w*.5);
      const dy=baseY+sin(dx*.025+w)*22+n*18-9;
      fill(h,90,100,alpha); noStroke();
      circle(dx,dy,map(w,0,3,6,3));
    }
  }
  noGlow();
}

// ── PISCIS: Dos peces yin-yang ────────────────────────────────────────────────
function drawPiscis(){
  const cx=W/2,cy=H/2-10;
  const R=150;

  // Anillo exterior
  stroke(HUE,60,80,55); strokeWeight(1.5); noFill();
  glow(hsl(HUE,80,60),14);
  circle(cx,cy,R*2+20);
  noGlow();

  // Pez 1 — curva yin (arriba)
  function drawFish(startAngle, hueF, hueF2, eye_off){
    const c1=color(hueF,85,80,85), c2=color(hueF2,70,75,60);
    // Cuerpo con curveVertex
    noStroke(); fill(c1);
    glow(hsl(hueF,90,65),22);
    beginShape();
    for(let t=0;t<=1;t+=0.02){
      const a=lerp(startAngle,startAngle+PI,t);
      const r=R*.72;
      const ox=noise(t*3+hueF*.01)*18-9;
      curveVertex(cx+r*cos(a)+ox*cos(a+PI/2),cy+r*sin(a)+ox*sin(a+PI/2));
    }
    // Semicírculo interior
    for(let t=1;t>=0;t-=0.02){
      const a=lerp(startAngle,startAngle+PI,t);
      const r=R*.28;
      curveVertex(cx+r*cos(a),cy+r*sin(a));
    }
    endShape(CLOSE);
    noGlow();

    // Aleta caudal
    stroke(c1); strokeWeight(4); noFill();
    glow(hsl(hueF,85,68),16);
    const tx=cx+R*.72*cos(startAngle), ty=cy+R*.72*sin(startAngle);
    beginShape();
    curveVertex(tx,ty);curveVertex(tx,ty);
    curveVertex(tx+cos(startAngle-PI/2)*30,ty+sin(startAngle-PI/2)*30);
    curveVertex(tx+cos(startAngle-PI/2)*52,ty+sin(startAngle-PI/2)*22);
    curveVertex(tx+cos(startAngle-PI/2)*52,ty+sin(startAngle-PI/2)*22);
    endShape();
    beginShape();
    curveVertex(tx,ty);curveVertex(tx,ty);
    curveVertex(tx+cos(startAngle+PI/2)*30,ty+sin(startAngle+PI/2)*30);
    curveVertex(tx+cos(startAngle+PI/2)*52,ty+sin(startAngle+PI/2)*22);
    curveVertex(tx+cos(startAngle+PI/2)*52,ty+sin(startAngle+PI/2)*22);
    endShape();
    noGlow();

    // Ojo
    const ex=cx+R*.72*cos(startAngle+PI*.75)+eye_off*cos(startAngle+PI/2);
    const ey=cy+R*.72*sin(startAngle+PI*.75)+eye_off*sin(startAngle+PI/2);
    drawEye(ex,ey,13,hueF);

    // Punto yin-yang interior (color opuesto)
    fill(hueF2,80,85,90); noStroke();
    glow(hsl(hueF2,90,75),18);
    circle(cx+R*.28*cos(startAngle+PI*.5),cy+R*.28*sin(startAngle+PI*.5),22);
  }

  drawFish(-PI/2, HUE, HUE2, 20);
  drawFish(PI/2,  HUE2, HUE, -20);

  // Centro
  fill(255,0,100,80); noStroke();
  glow('rgba(255,255,255,0.8)',15);
  circle(cx,cy,12);
  noGlow();
}

// ── Símbolo central grande ─────────────────────────────────────────────────────
function drawSymbol(){
  const cx=W/2, cy=H/2-20;

  // Halo exterior difuso
  drawingContext.save();
  const halo=drawingContext.createRadialGradient(cx,cy,0,cx,cy,260);
  halo.addColorStop(0,hsl(HUE,90,60)+'55');
  halo.addColorStop(0.5,hsl(HUE2,80,50)+'22');
  halo.addColorStop(1,'transparent');
  drawingContext.fillStyle=halo;
  drawingContext.fillRect(0,0,W,H);
  drawingContext.restore();

  // Anillo decorativo exterior
  noFill(); stroke(HUE,70,80,30); strokeWeight(1.2);
  circle(cx,cy,420);
  stroke(HUE2,60,75,20); strokeWeight(0.8);
  circle(cx,cy,380);

  // Marcas en el anillo (12 posiciones)
  for(let i=0;i<12;i++){
    const a=i*TWO_PI/12-HALF_PI;
    const r1=188, r2=i%3===0?202:196;
    stroke(HUE,80,90,i%3===0?70:40);
    strokeWeight(i%3===0?2:1);
    glow(hsl(HUE,80,75),i%3===0?10:4);
    line(cx+r1*cos(a),cy+r1*sin(a),cx+r2*cos(a),cy+r2*sin(a));
  }

  // Símbolo — capa glow profunda
  noStroke(); textAlign(CENTER,CENTER); textFont('serif');
  const SZ=260;

  // Capa 1: glow suave muy grande
  drawingContext.shadowBlur=90;
  drawingContext.shadowColor=hsl(HUE,90,60);
  fill(HUE,80,85,18);
  textSize(SZ); text(SYM,cx,cy+8);

  // Capa 2: glow medio
  drawingContext.shadowBlur=45;
  drawingContext.shadowColor=hsl(HUE2,90,70);
  fill(HUE2,70,90,30);
  text(SYM,cx,cy+8);

  // Capa 3: símbolo principal nítido
  drawingContext.shadowBlur=22;
  drawingContext.shadowColor=hsl(HUE,90,80);
  fill(HUE,15,100,88);
  text(SYM,cx,cy+8);

  // Capa 4: highlight brillante encima
  drawingContext.shadowBlur=8;
  fill(HUE,5,100,55);
  textSize(SZ*0.92);
  text(SYM,cx,cy+6);

  drawingContext.shadowBlur=0;
  noGlow();
}

// ── Constelación prominente ────────────────────────────────────────────────────
function drawConstellationUI(){
  const PADX=0.07, PADY_TOP=0.10, PADY_BOT=0.83;
  const pts=STARS.map(s=>({
    x:(PADX+s[0]*(1-PADX*2))*W,
    y:PADY_TOP*H+s[1]*(PADY_BOT-PADY_TOP)*H,
    r:s[2]??4
  }));

  // Líneas — 3 capas para efecto luminoso
  LINES.forEach(([a,b])=>{
    const pa=pts[a],pb=pts[b];
    if(!pa||!pb) return;
    // Capa glow ancho
    stroke(HUE,80,85,18); strokeWeight(8);
    glow(hsl(HUE,85,70),14);
    line(pa.x,pa.y,pb.x,pb.y);
    // Capa media
    stroke(HUE,60,95,45); strokeWeight(2.5);
    line(pa.x,pa.y,pb.x,pb.y);
    // Capa fina brillante
    stroke(0,0,100,70); strokeWeight(0.8);
    line(pa.x,pa.y,pb.x,pb.y);
  });
  noGlow();

  // Nodos — estrellas con rayos
  pts.forEach((p,i)=>{
    const r=p.r;
    const isMain=r>=5;

    // Halo exterior
    noStroke();
    glow(hsl(HUE,90,70),isMain?28:16);
    fill(HUE,70,90,isMain?22:12);
    circle(p.x,p.y,r*isMain?8.5:6);

    // Anillo
    noFill();
    stroke(HUE,80,95,isMain?75:55); strokeWeight(isMain?1.8:1.2);
    glow(hsl(HUE,90,80),isMain?18:10);
    circle(p.x,p.y,r*(isMain?3.8:3.2));

    // Punto central
    noStroke(); fill(0,0,100,isMain?95:85);
    glow('rgba(255,255,255,0.9)',isMain?14:8);
    circle(p.x,p.y,r*(isMain?1.1:0.85));

    // Rayos en estrellas grandes
    if(isMain){
      const sl=r*5.5;
      stroke(0,0,100,50); strokeWeight(0.9); noFill();
      [[sl,0],[0,sl],[sl*.65,sl*.65],[sl*.65,-sl*.65]].forEach(([dx,dy])=>{
        const g2=drawingContext.createLinearGradient(p.x-dx,p.y-dy,p.x+dx,p.y+dy);
        g2.addColorStop(0,'rgba(255,255,255,0)');
        g2.addColorStop(0.5,'rgba(255,255,255,0.65)');
        g2.addColorStop(1,'rgba(255,255,255,0)');
        drawingContext.strokeStyle=g2;
        drawingContext.lineWidth=0.9;
        drawingContext.beginPath();
        drawingContext.moveTo(p.x-dx,p.y-dy);
        drawingContext.lineTo(p.x+dx,p.y+dy);
        drawingContext.stroke();
      });
    }
    noGlow();
  });
}

// ── Branding UI ───────────────────────────────────────────────────────────────
function drawBranding(){
  // Línea superior
  stroke(HUE,70,80,50); strokeWeight(1);
  const lx1=W*.10,lx2=W*.90;
  line(lx1,75,lx2,75);

  // Logo Om Domo
  fill(0,0,100,92); noStroke();
  textAlign(LEFT,CENTER); textFont('Georgia'); textSize(24); textStyle(BOLD);
  glow(hsl(HUE,50,80),10);
  text('Om Domo',28,42);
  textSize(11); textStyle(NORMAL);
  fill(HUE,80,80,72);
  text('NFT · AVALANCHE MAINNET',28,62);

  // Badge rarity
  fill(HUE,70,50,20); noStroke();
  glow(hsl(HUE,80,60),15);
  rect(W-190,14,170,48,24);
  stroke(HUE,80,85,60); strokeWeight(1); noFill();
  rect(W-190,14,170,48,24);
  fill(HUE,90,90,95); noStroke(); textAlign(CENTER,CENTER); textSize(11); textStyle(BOLD);
  text('GENESIS · ERC-1155',W-105,32);
  fill(0,0,75,70); textSize(10); textStyle(NORMAL);
  text(EL.toUpperCase(),W-105,52);

  // Línea inferior + label constelación
  const consLabel={
    genesis:'GENESIS · SACRED GEOMETRY',aries:'ARIES · THE RAM',
    tauro:'TAURUS · THE BULL',geminis:'GEMINI · THE TWINS',
    cancer:'CANCER · THE CRAB',leo:'LEO · THE LION',
    virgo:'VIRGO · THE MAIDEN',libra:'LIBRA · THE SCALES',
    escorpio:'SCORPIUS · THE SCORPION',sagitario:'SAGITTARIUS · THE ARCHER',
    capricornio:'CAPRICORNUS · THE SEA-GOAT',acuario:'AQUARIUS · THE WATER BEARER',
    piscis:'PISCES · THE FISH'
  }[KEY]||KEY;

  stroke(HUE,70,80,45); strokeWeight(1);
  line(lx1,H*.848,lx2,H*.848);
  fill(HUE,60,80,40); noStroke(); textAlign(CENTER,CENTER); textSize(13); textStyle(ITALIC);
  text(consLabel,W*.5,H*.871);

  // Nombre signo con glow
  stroke(HUE,90,90,85); strokeWeight(1);
  line(lx1,H*.848,lx2,H*.848);
  glow(hsl(HUE,95,65),26);
  const sz=NAME.length>8?50:62;
  textAlign(LEFT,BOTTOM); textStyle(BOLD); textFont('Georgia'); textSize(sz);
  fill(HUE,20,100,97);
  text(NAME,28,H*.960);
  noGlow();

  // Símbolo con orbe
  const sx=W-62,sy=H*.91;
  noStroke(); glow(hsl(HUE,90,60),25);
  fill(HUE,70,50,20); circle(sx,sy,88);
  stroke(HUE,80,90,35); strokeWeight(1); noFill();
  circle(sx,sy,72);
  noStroke(); fill(HUE,15,100,95);
  glow(hsl(HUE,90,80),30);
  textAlign(CENTER,CENTER); textSize(44); textStyle(BOLD); textFont('serif');
  text(SYM,sx,sy+2);

  // Watermark
  noGlow();
  fill(0,0,100,13); textAlign(RIGHT,BOTTOM); textSize(11); textStyle(NORMAL); textFont('monospace');
  text('#'+ID+' · web3.omdomo.com',W-24,H-18);

  // Marco
  glow(hsl(HUE,90,70),12);
  stroke(HUE,80,85,75); strokeWeight(2.5); noFill();
  rect(5,5,W-10,H-10,2);
  stroke(HUE,60,80,15); strokeWeight(1);
  rect(13,13,W-26,H-26,2);
  // Esquinas decorativas
  stroke(HUE,85,90,80); strokeWeight(2);
  [[13,13],[W-13,13],[13,H-13],[W-13,H-13]].forEach(([px,py],i)=>{
    const dx=i%2===0?28:-28, dy=i<2?28:-28;
    line(px,py,px+dx,py); line(px,py,px,py+dy);
  });
  noGlow();
}

function draw(){
  drawBackground();
  drawSymbol();
  drawConstellationUI();
  drawBranding();
  document.title='DONE';
}
</script></body></html>`;
}

// ── Puppeteer runner ───────────────────────────────────────────────────────────
async function generateAll() {
  console.log('🚀 Iniciando generación con p5.js + Puppeteer...\n');
  const browser = await puppeteer.launch({
    headless: true,
    protocolTimeout: 120000,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-web-security'],
  });

  for (const nft of NFTs) {
    const html = makeHTML(nft);
    const tmpFile = path.join(OUT_DIR, `_tmp_${nft.id}.html`);
    fs.writeFileSync(tmpFile, html);

    const page = await browser.newPage();
    await page.setViewport({ width:1000, height:1000, deviceScaleFactor:1 });
    await page.goto(`file://${tmpFile}`, { waitUntil:'domcontentloaded' });

    try {
      await page.waitForFunction(() => document.title === 'DONE', { timeout:30000 });
    } catch(e) {
      console.warn(`  ⚠ Timeout en ${nft.nameES}, capturando de todas formas...`);
    }

    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(OUT_DIR, `${nft.id}.png`),
      clip: { x:0, y:0, width:1000, height:1000 },
      captureBeyondViewport: false,
    });

    await page.close();
    fs.unlinkSync(tmpFile);
    console.log(`✓ ${nft.id}.png — ${nft.nameES}`);
  }

  await browser.close();
  console.log('\n✅ 13 NFTs generados en public/nft-assets/');
}

generateAll().catch(err => { console.error('Error:', err); process.exit(1); });
