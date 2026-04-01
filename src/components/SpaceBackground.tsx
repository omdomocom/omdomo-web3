"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  r: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  // Drift
  driftX: number;
  driftY: number;
  driftSpeed: number;
  driftOffset: number;
}

interface Shooting {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const starsRef = useRef<Star[]>([]);
  const shootingRef = useRef<Shooting[]>([]);
  const rafRef = useRef<number>(0);
  const lastShootRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars();
    }

    function initStars() {
      if (!canvas) return;
      const count = Math.floor((canvas.width * canvas.height) / 1600);
      starsRef.current = Array.from({ length: count }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return {
          x, y, baseX: x, baseY: y,
          r: Math.random() * 1.4 + 0.3,
          opacity: Math.random() * 0.6 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 2,
          driftY: (Math.random() - 0.5) * 2,
          driftSpeed: Math.random() * 0.0004 + 0.0001,
          driftOffset: Math.random() * Math.PI * 2,
        };
      });
    }

    function spawnShooting(canvas: HTMLCanvasElement) {
      // Random start on top or left edge
      const fromTop = Math.random() > 0.5;
      const x = fromTop ? Math.random() * canvas.width : 0;
      const y = fromTop ? 0 : Math.random() * canvas.height * 0.5;
      const angle = (Math.random() * 30 + 25) * (Math.PI / 180);
      const speed = Math.random() * 6 + 6;
      shootingRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: Math.random() * 120 + 60,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 40 + 30,
      });
    }

    function draw(time: number) {
      if (!canvas || !ctx) return;
      const t = time * 0.001;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space background
      const bg = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.4, 0,
        canvas.width * 0.5, canvas.height * 0.4, canvas.width * 0.8
      );
      bg.addColorStop(0, "#130a1e");
      bg.addColorStop(0.45, "#0c0612");
      bg.addColorStop(1, "#060308");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle nebula
      const neb = ctx.createRadialGradient(
        canvas.width * 0.28, canvas.height * 0.32, 0,
        canvas.width * 0.28, canvas.height * 0.32, canvas.width * 0.32
      );
      neb.addColorStop(0, "rgba(100, 30, 180, 0.06)");
      neb.addColorStop(1, "transparent");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const neb2 = ctx.createRadialGradient(
        canvas.width * 0.78, canvas.height * 0.65, 0,
        canvas.width * 0.78, canvas.height * 0.65, canvas.width * 0.22
      );
      neb2.addColorStop(0, "rgba(0, 60, 130, 0.05)");
      neb2.addColorStop(1, "transparent");
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const GRAVITY_RADIUS = 160;
      const STRENGTH = 55;

      // Stars
      for (const star of starsRef.current) {
        // Drift — slow organic movement
        const driftAmt = Math.sin(t * star.driftSpeed * 1000 + star.driftOffset);
        star.baseX += star.driftX * star.driftSpeed;
        star.baseY += star.driftY * star.driftSpeed;
        // Wrap edges
        if (star.baseX < 0) star.baseX = canvas.width;
        if (star.baseX > canvas.width) star.baseX = 0;
        if (star.baseY < 0) star.baseY = canvas.height;
        if (star.baseY > canvas.height) star.baseY = 0;

        const dx = mx - star.baseX;
        const dy = my - star.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < GRAVITY_RADIUS && dist > 0) {
          const force = (1 - dist / GRAVITY_RADIUS);
          const warp = force * force * STRENGTH;
          star.x = star.baseX + (dx / dist) * warp;
          star.y = star.baseY + (dy / dist) * warp;
        } else {
          star.x += (star.baseX - star.x) * 0.08;
          star.y += (star.baseY - star.y) * 0.08;
        }

        // Twinkle
        const twinkle = Math.sin(t * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.22 + 0.78;
        const alpha = star.opacity * twinkle;
        const proximity = dist < GRAVITY_RADIUS ? (1 - dist / GRAVITY_RADIUS) : 0;
        const boostR = star.r + proximity * 0.6;
        const boostAlpha = Math.min(1, alpha + proximity * 0.2);

        ctx.beginPath();
        ctx.arc(star.x, star.y, boostR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215,212,208,${boostAlpha})`;
        ctx.fill();

        // Cross flare for bigger stars
        if (star.r > 1.0) {
          ctx.strokeStyle = `rgba(215,212,208,${boostAlpha * 0.2})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(star.x - boostR * 2.5, star.y);
          ctx.lineTo(star.x + boostR * 2.5, star.y);
          ctx.moveTo(star.x, star.y - boostR * 2.5);
          ctx.lineTo(star.x, star.y + boostR * 2.5);
          ctx.stroke();
        }

        void driftAmt;
      }

      // Shooting stars
      if (time - lastShootRef.current > (Math.random() * 4000 + 3000)) {
        lastShootRef.current = time;
        if (shootingRef.current.length < 3) spawnShooting(canvas);
      }

      shootingRef.current = shootingRef.current.filter((s) => s.life < s.maxLife);
      for (const s of shootingRef.current) {
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        const progress = s.life / s.maxLife;
        const a = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;
        const tailX = s.x - s.vx * (s.len / (s.vx || 1));
        const tailY = s.y - s.vy * (s.len / (s.vy || 1));

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.6, `rgba(210,208,220,${a * 0.3})`);
        grad.addColorStop(1, `rgba(230,228,240,${a})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Tip glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,238,255,${a})`;
        ctx.fill();
      }

      // Cursor ring — very subtle, dark
      if (mx > 0 && mx < canvas.width && my > 0 && my < canvas.height) {
        const ring = ctx.createRadialGradient(mx, my, GRAVITY_RADIUS * 0.7, mx, my, GRAVITY_RADIUS);
        ring.addColorStop(0, "rgba(80,40,120,0.04)");
        ring.addColorStop(0.7, "rgba(60,30,100,0.02)");
        ring.addColorStop(1, "transparent");
        ctx.fillStyle = ring;
        ctx.beginPath();
        ctx.arc(mx, my, GRAVITY_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    rafRef.current = requestAnimationFrame(draw);

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onLeave() { mouseRef.current = { x: -9999, y: -9999 }; }

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ display: "block" }}
    />
  );
}
