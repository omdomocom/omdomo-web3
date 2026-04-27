import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// CSP: en dev permite unsafe-eval (HMR/React DevTools); en prod solo unsafe-inline para Next.js inline scripts
const cspScriptSrc = isDev
  ? "'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live"
  : "'self' 'unsafe-inline' https://vercel.live";

const securityHeaders = [
  // Previene clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Previene MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer policy
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Permisos de browser APIs
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
  // DNS prefetch control
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // HSTS — 1 año, incluye subdominios + preload
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Cross-Origin Opener Policy — permite popups de wallets (MetaMask, WalletConnect)
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  // Cross-Origin Resource Policy
  {
    key: "Cross-Origin-Resource-Policy",
    value: "cross-origin",
  },
  // Content Security Policy
  // Permite: self + Thirdweb + Avalanche RPCs + Vercel Analytics + Google Fonts
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src ${cspScriptSrc}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.thirdweb.com https://*.ipfs.io https://ipfs.io https://gateway.pinata.cloud https://*.amazonaws.com https://ipfs.thirdwebcdn.com",
      "connect-src 'self' https://*.thirdweb.com https://api.thirdweb.com wss://*.thirdweb.com https://api.avax.network https://api.avax-test.network https://*.avax.network https://avalanche-mainnet.infura.io https://api.coingecko.com https://vercel.live wss://ws.pusherapp.com https://*.ankr.com https://rpc.ankr.com",
      "frame-src 'self' https://auth.thirdweb.com https://embedded-wallet.thirdweb.com https://id.thirdweb.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Aplica security headers en todas las rutas
  // Nota: vercel.json también los aplica a nivel CDN como capa primaria
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // Dominios permitidos para next/image
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.thirdweb.com" },
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "**.ipfs.io" },
      { protocol: "https", hostname: "gateway.pinata.cloud" },
    ],
  },

  // Previene que headers de servidor se filtren al cliente
  serverExternalPackages: ["ioredis", "@supabase/supabase-js"],

  // Silencia el warning de pino-pretty (dependencia opcional de WalletConnect)
  webpack(config) {
    config.resolve.fallback = { ...config.resolve.fallback, "pino-pretty": false };
    return config;
  },
};

export default nextConfig;
