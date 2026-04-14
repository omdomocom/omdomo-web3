import type { NextConfig } from "next";

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
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // XSS protection (legacy browsers)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // DNS prefetch control
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // HSTS — 1 año, incluye subdominios
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Content Security Policy
  // Permite: self + Thirdweb + Avalanche RPCs + Vercel Analytics + Google Fonts
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.thirdweb.com https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.thirdweb.com https://*.ipfs.io https://ipfs.io https://gateway.pinata.cloud https://*.amazonaws.com",
      "connect-src 'self' https://*.thirdweb.com https://api.thirdweb.com wss://*.thirdweb.com https://api.avax.network https://api.avax-test.network https://avalanche-mainnet.infura.io https://api.coingecko.com https://vercel.live wss://ws.pusherapp.com https://*.supabase.co wss://*.supabase.co",
      "frame-src 'self' https://auth.thirdweb.com https://embedded-wallet.thirdweb.com",
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Aplica security headers en todas las rutas
  async headers() {
    return [
      {
        source: "/(.*)",
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
