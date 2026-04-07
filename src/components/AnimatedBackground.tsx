"use client";

// ─── Animated background layers for each theme ────────────────────────────
// GPU-accelerated CSS animations — no canvas needed

export function CloudsBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d1f3c 40%, #1a3a5c 100%)" }}>
      <style>{`
        @keyframes cloud-drift {
          0%   { transform: translateX(-120%) translateY(0); }
          100% { transform: translateX(120vw) translateY(0); }
        }
        @keyframes cloud-drift2 {
          0%   { transform: translateX(-150%) translateY(0); }
          100% { transform: translateX(120vw) translateY(0); }
        }
        @keyframes cloud-bob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        .cloud {
          position: absolute;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
          filter: blur(18px);
          animation: cloud-drift linear infinite;
        }
        .cloud::before, .cloud::after {
          content: '';
          position: absolute;
          background: inherit;
          border-radius: 50%;
          filter: blur(4px);
        }
      `}</style>

      {/* Moon glow */}
      <div style={{ position: "absolute", top: "8%", right: "12%", width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,230,255,0.18) 0%, transparent 70%)", filter: "blur(8px)" }} />
      <div style={{ position: "absolute", top: "9%", right: "12.5%", width: 38, height: 38, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,230,255,0.45) 0%, rgba(160,190,230,0.2) 60%, transparent 80%)", boxShadow: "0 0 30px rgba(180,210,255,0.3)" }} />

      {/* Big cloud 1 */}
      <div style={{ position: "absolute", top: "18%", width: 340, height: 110, borderRadius: "55px", background: "rgba(200,220,255,0.07)", filter: "blur(22px)", animation: "cloud-drift 45s linear infinite", animationDelay: "0s" }} />
      {/* Big cloud 2 */}
      <div style={{ position: "absolute", top: "32%", width: 480, height: 90, borderRadius: "45px", background: "rgba(180,210,255,0.05)", filter: "blur(28px)", animation: "cloud-drift 60s linear infinite", animationDelay: "-20s" }} />
      {/* Medium cloud 1 */}
      <div style={{ position: "absolute", top: "12%", width: 220, height: 65, borderRadius: "35px", background: "rgba(210,225,255,0.09)", filter: "blur(16px)", animation: "cloud-drift2 38s linear infinite", animationDelay: "-10s" }} />
      {/* Medium cloud 2 */}
      <div style={{ position: "absolute", top: "55%", width: 300, height: 75, borderRadius: "40px", background: "rgba(160,200,240,0.06)", filter: "blur(20px)", animation: "cloud-drift 52s linear infinite", animationDelay: "-35s" }} />
      {/* Small cloud 1 */}
      <div style={{ position: "absolute", top: "40%", width: 160, height: 50, borderRadius: "28px", background: "rgba(200,220,250,0.07)", filter: "blur(14px)", animation: "cloud-drift2 32s linear infinite", animationDelay: "-15s" }} />
      {/* Small cloud 2 */}
      <div style={{ position: "absolute", top: "68%", width: 200, height: 55, borderRadius: "30px", background: "rgba(170,205,240,0.05)", filter: "blur(16px)", animation: "cloud-drift 42s linear infinite", animationDelay: "-28s" }} />
      {/* Tiny cloud accent */}
      <div style={{ position: "absolute", top: "25%", width: 100, height: 35, borderRadius: "20px", background: "rgba(220,235,255,0.08)", filter: "blur(10px)", animation: "cloud-drift2 28s linear infinite", animationDelay: "-5s" }} />

      {/* Horizon glow */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, rgba(20,60,110,0.4), transparent)" }} />
    </div>
  );
}

export function OceanBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: "linear-gradient(180deg, #020b18 0%, #021528 30%, #031e38 60%, #021228 100%)" }}>
      <style>{`
        @keyframes bubble-rise {
          0%   { transform: translateY(0) translateX(0) scale(1);   opacity: 0; }
          10%  { opacity: 0.6; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(-110vh) translateX(var(--drift)) scale(0.6); opacity: 0; }
        }
        @keyframes wave-move {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ray-flicker {
          0%, 100% { opacity: 0.03; }
          50%       { opacity: 0.08; }
        }
        .bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, rgba(100,200,255,0.4), rgba(50,150,220,0.1));
          border: 1px solid rgba(100,200,255,0.2);
          animation: bubble-rise linear infinite;
        }
      `}</style>

      {/* Light rays from above */}
      {[15, 35, 55, 70, 85].map((left, i) => (
        <div key={i} style={{
          position: "absolute", top: 0, left: `${left}%`, width: `${60 + i * 15}px`, height: "65%",
          background: `linear-gradient(180deg, rgba(80,180,255,0.06), transparent)`,
          transform: `skewX(${(i % 2 === 0 ? 8 : -8)}deg)`,
          animation: `ray-flicker ${3 + i * 0.7}s ease-in-out infinite`,
          animationDelay: `${i * 0.6}s`,
          transformOrigin: "top center",
        }} />
      ))}

      {/* Bubbles */}
      {[
        { left: "8%",  size: 6,  dur: 9,  delay: 0,   drift: "8px"  },
        { left: "18%", size: 10, dur: 13, delay: 2,   drift: "-12px"},
        { left: "29%", size: 5,  dur: 8,  delay: 4,   drift: "5px"  },
        { left: "42%", size: 14, dur: 16, delay: 1,   drift: "15px" },
        { left: "55%", size: 7,  dur: 11, delay: 6,   drift: "-8px" },
        { left: "65%", size: 9,  dur: 12, delay: 3,   drift: "10px" },
        { left: "75%", size: 5,  dur: 7,  delay: 7,   drift: "-5px" },
        { left: "85%", size: 12, dur: 15, delay: 0.5, drift: "12px" },
        { left: "22%", size: 8,  dur: 10, delay: 9,   drift: "-9px" },
        { left: "48%", size: 6,  dur: 9,  delay: 11,  drift: "6px"  },
        { left: "90%", size: 11, dur: 14, delay: 5,   drift: "-11px"},
        { left: "33%", size: 4,  dur: 6,  delay: 8,   drift: "4px"  },
      ].map((b, i) => (
        <div key={i} className="bubble" style={{
          bottom: "-20px",
          left: b.left,
          width: b.size,
          height: b.size,
          animation: `bubble-rise ${b.dur}s linear infinite`,
          animationDelay: `${b.delay}s`,
          ["--drift" as string]: b.drift,
        }} />
      ))}

      {/* Wave overlays */}
      <div style={{
        position: "absolute", bottom: "8%", left: 0,
        width: "200%", height: "80px",
        background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 60'%3E%3Cpath d='M0,30 C200,55 400,5 600,30 C800,55 1000,5 1200,30 L1200,60 L0,60Z' fill='rgba(0,100,200,0.08)'/%3E%3C/svg%3E\") repeat-x",
        backgroundSize: "600px 80px",
        animation: "wave-move 12s linear infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "4%", left: 0,
        width: "200%", height: "60px",
        background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 60'%3E%3Cpath d='M0,20 C300,50 600,0 900,25 C1050,38 1150,10 1200,20 L1200,60 L0,60Z' fill='rgba(0,120,220,0.07)'/%3E%3C/svg%3E\") repeat-x",
        backgroundSize: "800px 60px",
        animation: "wave-move 18s linear infinite reverse",
      }} />

      {/* Deep glow */}
      <div style={{ position: "absolute", bottom: "-10%", left: "50%", transform: "translateX(-50%)", width: "80%", height: "50%", background: "radial-gradient(ellipse, rgba(0,100,180,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
    </div>
  );
}

export function LavaBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: "linear-gradient(180deg, #0e0300 0%, #1a0500 50%, #0a0200 100%)" }}>
      <style>{`
        @keyframes lava-move-1 {
          0%   { transform: translate(0,0)   scale(1)    rotate(0deg);   border-radius: 40% 60% 60% 40% / 50% 40% 60% 50%; }
          25%  { transform: translate(60px, -80px) scale(1.15) rotate(90deg);  border-radius: 60% 40% 40% 60% / 60% 50% 40% 40%; }
          50%  { transform: translate(-30px,60px) scale(0.9)  rotate(180deg); border-radius: 50% 50% 60% 40% / 40% 60% 50% 50%; }
          75%  { transform: translate(80px,30px)  scale(1.1)  rotate(270deg); border-radius: 40% 60% 50% 50% / 60% 40% 60% 40%; }
          100% { transform: translate(0,0)   scale(1)    rotate(360deg); border-radius: 40% 60% 60% 40% / 50% 40% 60% 50%; }
        }
        @keyframes lava-move-2 {
          0%   { transform: translate(0,0)    scale(1)    rotate(0deg);   border-radius: 60% 40% 50% 50% / 40% 60% 40% 60%; }
          33%  { transform: translate(-70px,50px)  scale(1.2)  rotate(-120deg); border-radius: 50% 50% 40% 60% / 60% 40% 60% 40%; }
          66%  { transform: translate(50px,-70px) scale(0.85) rotate(-240deg); border-radius: 40% 60% 60% 40% / 50% 50% 40% 60%; }
          100% { transform: translate(0,0)    scale(1)    rotate(-360deg); border-radius: 60% 40% 50% 50% / 40% 60% 40% 60%; }
        }
        @keyframes lava-move-3 {
          0%   { transform: translate(0,0)   scale(1);    border-radius: 50% 50% 40% 60% / 60% 40% 60% 40%; }
          50%  { transform: translate(-40px,-60px) scale(1.3); border-radius: 60% 40% 60% 40% / 40% 60% 40% 60%; }
          100% { transform: translate(0,0)   scale(1);    border-radius: 50% 50% 40% 60% / 60% 40% 60% 40%; }
        }
        @keyframes lava-pulse {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.28; }
        }
      `}</style>

      {/* Lava blobs */}
      <div style={{
        position: "absolute", top: "20%", left: "15%",
        width: 320, height: 280,
        background: "radial-gradient(circle, #ff4400 0%, #cc2200 40%, #880800 70%, transparent 100%)",
        filter: "blur(45px)",
        animation: "lava-move-1 18s ease-in-out infinite",
        opacity: 0.22,
      }} />
      <div style={{
        position: "absolute", top: "50%", right: "10%",
        width: 380, height: 320,
        background: "radial-gradient(circle, #ff6600 0%, #dd3300 40%, #990000 70%, transparent 100%)",
        filter: "blur(55px)",
        animation: "lava-move-2 24s ease-in-out infinite",
        animationDelay: "-8s",
        opacity: 0.2,
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "35%",
        width: 280, height: 240,
        background: "radial-gradient(circle, #ff8800 0%, #ee4400 40%, #aa1100 70%, transparent 100%)",
        filter: "blur(40px)",
        animation: "lava-move-3 14s ease-in-out infinite",
        animationDelay: "-5s",
        opacity: 0.18,
      }} />
      <div style={{
        position: "absolute", top: "5%", right: "30%",
        width: 200, height: 180,
        background: "radial-gradient(circle, #ffaa00 0%, #ff5500 50%, transparent 80%)",
        filter: "blur(35px)",
        animation: "lava-move-1 20s ease-in-out infinite reverse",
        animationDelay: "-12s",
        opacity: 0.16,
      }} />

      {/* Ground lava pool */}
      <div style={{
        position: "absolute", bottom: 0, left: "10%", right: "10%", height: "25%",
        background: "radial-gradient(ellipse at bottom, rgba(255,80,0,0.2) 0%, transparent 70%)",
        filter: "blur(30px)",
        animation: "lava-pulse 4s ease-in-out infinite",
      }} />

      {/* Crackling surface texture */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 80%, rgba(255,60,0,0.08), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255,120,0,0.06), transparent 50%)" }} />
    </div>
  );
}

export function ForestBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: "linear-gradient(180deg, #010a02 0%, #020e04 40%, #010806 100%)" }}>
      <style>{`
        @keyframes tree-sway-1 {
          0%, 100% { transform: rotate(0deg);   }
          25%       { transform: rotate(1.2deg); }
          75%       { transform: rotate(-0.8deg);}
        }
        @keyframes tree-sway-2 {
          0%, 100% { transform: rotate(0deg);    }
          30%       { transform: rotate(-1.5deg); }
          70%       { transform: rotate(0.9deg);  }
        }
        @keyframes leaf-drift {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.6; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(110vh) translateX(var(--leaf-x)) rotate(720deg); opacity: 0; }
        }
        @keyframes firefly {
          0%, 100% { opacity: 0;   transform: translate(0,0)    scale(1); }
          25%       { opacity: 0.8; transform: translate(var(--fx),var(--fy)) scale(1.3); }
          50%       { opacity: 0.2; transform: translate(calc(var(--fx)*1.5), calc(var(--fy)*0.5)) scale(0.8); }
          75%       { opacity: 0.9; transform: translate(var(--fx),calc(var(--fy)*-0.3)) scale(1.1); }
        }
        @keyframes mist-drift {
          0%   { transform: translateX(-30px); opacity: 0.04; }
          50%  { transform: translateX(30px);  opacity: 0.08; }
          100% { transform: translateX(-30px); opacity: 0.04; }
        }
        .tree-sway-1 { transform-origin: bottom center; animation: tree-sway-1 6s ease-in-out infinite; }
        .tree-sway-2 { transform-origin: bottom center; animation: tree-sway-2 8s ease-in-out infinite; }
        .leaf { position: absolute; width: 6px; height: 6px; border-radius: 50% 0; background: rgba(40,160,60,0.5); animation: leaf-drift linear infinite; }
        .firefly { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: rgba(160,255,100,0.9); filter: blur(1px); box-shadow: 0 0 6px rgba(160,255,100,0.6); animation: firefly ease-in-out infinite; }
      `}</style>

      {/* Sky glow */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: "40%", background: "radial-gradient(ellipse at top, rgba(0,40,10,0.6), transparent 70%)" }} />

      {/* Moon */}
      <div style={{ position: "absolute", top: "6%", right: "18%", width: 32, height: 32, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,230,190,0.5) 0%, rgba(100,180,120,0.2) 60%, transparent 80%)", boxShadow: "0 0 20px rgba(100,200,120,0.2)" }} />

      {/* Far trees (background layer) */}
      <svg viewBox="0 0 1400 400" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", height: "55%", opacity: 0.18 }}>
        {[0,90,180,260,350,440,520,610,700,790,880,960,1050,1140,1220,1310].map((x, i) => (
          <g key={i} className={i % 2 === 0 ? "tree-sway-1" : "tree-sway-2"} style={{ animationDelay: `${i * 0.4}s` }}>
            <polygon points={`${x},400 ${x+35},220 ${x+70},400`} fill="#1a4a1e" />
            <polygon points={`${x+5},300 ${x+35},140 ${x+65},300`} fill="#1e5522" />
            <polygon points={`${x+10},220 ${x+35},60 ${x+60},220`} fill="#22602a" />
            <rect x={x+30} y={370} width={10} height={30} fill="#0d2610" />
          </g>
        ))}
      </svg>

      {/* Mid trees */}
      <svg viewBox="0 0 1400 500" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", height: "60%", opacity: 0.35 }}>
        {[-30,80,190,300,410,530,640,760,870,980,1090,1200,1310].map((x, i) => (
          <g key={i} className={i % 2 === 0 ? "tree-sway-2" : "tree-sway-1"} style={{ animationDelay: `${i * 0.55}s` }}>
            <polygon points={`${x},500 ${x+50},260 ${x+100},500`} fill="#163a1a" />
            <polygon points={`${x+8},380 ${x+50},160 ${x+92},380`} fill="#1c4820" />
            <polygon points={`${x+15},280 ${x+50},80 ${x+85},280`} fill="#204e26" />
            <rect x={x+43} y={460} width={14} height={40} fill="#0a1e0c" />
          </g>
        ))}
      </svg>

      {/* Foreground trees (large, silhouette) */}
      <svg viewBox="0 0 1400 600" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", height: "70%", opacity: 0.7 }}>
        {[-60,120,300,490,680,870,1060,1250].map((x, i) => (
          <g key={i} className={i % 2 === 0 ? "tree-sway-1" : "tree-sway-2"} style={{ animationDelay: `${i * 0.7}s` }}>
            <polygon points={`${x},600 ${x+70},260 ${x+140},600`} fill="#0d2410" />
            <polygon points={`${x+10},460 ${x+70},160 ${x+130},460`} fill="#102a14" />
            <polygon points={`${x+20},340 ${x+70},60 ${x+120},340`} fill="#133018" />
            <rect x={x+60} y={560} width={20} height={40} fill="#06120a" />
          </g>
        ))}
      </svg>

      {/* Ground mist */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "20%", background: "linear-gradient(to top, rgba(10,40,15,0.5) 0%, rgba(5,20,8,0.2) 60%, transparent 100%)" }} />
      <div style={{ position: "absolute", bottom: "5%", left: "-10%", right: "-10%", height: "12%", background: "rgba(20,60,25,0.12)", filter: "blur(20px)", animation: "mist-drift 10s ease-in-out infinite" }} />

      {/* Fireflies */}
      {[
        { left: "20%", top: "60%", fx: "30px",  fy: "-20px", dur: 4,   delay: 0   },
        { left: "40%", top: "70%", fx: "-25px", fy: "-30px", dur: 5.5, delay: 1   },
        { left: "60%", top: "55%", fx: "20px",  fy: "-15px", dur: 3.8, delay: 2   },
        { left: "75%", top: "65%", fx: "-30px", fy: "-25px", dur: 6,   delay: 0.5 },
        { left: "85%", top: "72%", fx: "15px",  fy: "-20px", dur: 4.5, delay: 3   },
        { left: "30%", top: "45%", fx: "-20px", fy: "-35px", dur: 7,   delay: 1.5 },
        { left: "55%", top: "40%", fx: "25px",  fy: "-18px", dur: 5,   delay: 2.5 },
        { left: "12%", top: "75%", fx: "-15px", fy: "-22px", dur: 4.2, delay: 4   },
      ].map((f, i) => (
        <div key={i} className="firefly" style={{
          left: f.left, top: f.top,
          animation: `firefly ${f.dur}s ease-in-out infinite`,
          animationDelay: `${f.delay}s`,
          ["--fx" as string]: f.fx,
          ["--fy" as string]: f.fy,
        }} />
      ))}

      {/* Leaves falling */}
      {[
        { left: "15%", dur: 12, delay: 0,  drift: "-80px" },
        { left: "35%", dur: 9,  delay: 3,  drift: "60px"  },
        { left: "55%", dur: 14, delay: 6,  drift: "-50px" },
        { left: "70%", dur: 10, delay: 1,  drift: "70px"  },
        { left: "85%", dur: 11, delay: 8,  drift: "-40px" },
      ].map((l, i) => (
        <div key={i} className="leaf" style={{
          top: "-10px", left: l.left,
          animation: `leaf-drift ${l.dur}s linear infinite`,
          animationDelay: `${l.delay}s`,
          ["--leaf-x" as string]: l.drift,
        }} />
      ))}
    </div>
  );
}

// ─── Solid color backgrounds ───────────────────────────────────────────────

export function SolidBackground({ color }: { color: string }) {
  return <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: color }} />;
}
