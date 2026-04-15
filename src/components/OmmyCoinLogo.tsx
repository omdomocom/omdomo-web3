// OmmyCoinLogo — Hexágono estilo panal de abeja
// Flat-top hexagon · Gradiente ámbar/dorado · Símbolo Ω (Omega = OMMY)
// Reutilizable con prop size (default 32px)

interface OmmyCoinLogoProps {
  size?: number;
  className?: string;
}

export function OmmyCoinLogo({ size = 32, className = "" }: OmmyCoinLogoProps) {
  const id = `ommy-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradiente principal — centro claro a borde oscuro */}
        <linearGradient id={`${id}-main`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#fde68a" />
          <stop offset="40%"  stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Brillo superior izquierdo */}
        <radialGradient id={`${id}-shine`} cx="35%" cy="28%" r="55%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* Sombra interna para profundidad */}
        <radialGradient id={`${id}-depth`} cx="65%" cy="72%" r="60%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* ── Sombra exterior (desplazada 1px abajo) ── */}
      <polygon
        points="29,17 22.5,5.74 9.5,5.74 3,17 9.5,28.26 22.5,28.26"
        fill="rgba(0,0,0,0.22)"
      />

      {/* ── Hexágono principal flat-top ── */}
      <polygon
        points="29,16 22.5,4.74 9.5,4.74 3,16 9.5,27.26 22.5,27.26"
        fill={`url(#${id}-main)`}
        stroke="#92400e"
        strokeWidth="0.4"
      />

      {/* ── Capa de brillo ── */}
      <polygon
        points="29,16 22.5,4.74 9.5,4.74 3,16 9.5,27.26 22.5,27.26"
        fill={`url(#${id}-shine)`}
      />

      {/* ── Profundidad/sombra interna ── */}
      <polygon
        points="29,16 22.5,4.74 9.5,4.74 3,16 9.5,27.26 22.5,27.26"
        fill={`url(#${id}-depth)`}
      />

      {/* ── Borde interior — efecto celda de panal ── */}
      <polygon
        points="25.5,16 20.25,7.07 11.75,7.07 6.5,16 11.75,24.93 20.25,24.93"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="0.7"
      />

      {/* ── Líneas de celda en los vértices (patrón panal) ── */}
      {[
        [29, 16,   25.5, 16  ],
        [22.5, 4.74, 20.25, 7.07],
        [9.5,  4.74, 11.75, 7.07],
        [3,    16,   6.5,  16  ],
        [9.5,  27.26, 11.75, 24.93],
        [22.5, 27.26, 20.25, 24.93],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.5"
        />
      ))}

      {/* ── Símbolo Ω centrado ── */}
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="white"
        fontWeight="900"
        fontSize="12"
        fontFamily="Georgia, 'Times New Roman', serif"
        style={{ filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.4))" }}
        opacity="0.95"
      >
        Ω
      </text>
    </svg>
  );
}

// Versión circular (para avatares/badges)
export function OmmyCoinBadge({ size = 32, className = "" }: OmmyCoinLogoProps) {
  return (
    <div
      className={`flex-shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <OmmyCoinLogo size={size} />
    </div>
  );
}
