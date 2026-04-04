// API — Precios crypto en tiempo real
// GET /api/prices
// Fuente: CoinGecko API (free tier) + OMMY mock
// Cache: 60 segundos para respetar rate limits

import { NextResponse } from "next/server";

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  sparkline: number[]; // 7 puntos diarios
  color: string;
  isOmmy?: boolean;
}

let cache: { data: CoinData[]; ts: number } | null = null;
const CACHE_TTL = 60_000; // 60 segundos

const COIN_META: Record<string, { color: string; name: string; symbol: string }> = {
  bitcoin:      { color: "#F7931A", name: "Bitcoin",   symbol: "BTC" },
  ethereum:     { color: "#627EEA", name: "Ethereum",  symbol: "ETH" },
  "avalanche-2":{ color: "#E84142", name: "Avalanche", symbol: "AVAX" },
  ripple:       { color: "#346AA9", name: "XRP",       symbol: "XRP" },
};

// Genera sparkline plausible a partir del precio actual y % de cambio 7d
function mockSparkline(currentPrice: number, change7d: number): number[] {
  const start = currentPrice / (1 + change7d / 100);
  return Array.from({ length: 7 }, (_, i) => {
    const progress = i / 6;
    const noise = (Math.random() - 0.5) * 0.04;
    return start + (currentPrice - start) * progress + start * noise;
  });
}

export async function GET() {
  // Serve from cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const ids = Object.keys(COIN_META).join(",");
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&sparkline=true&price_change_percentage=24h,7d&order=market_cap_desc`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any[] = await res.json();

    const coins: CoinData[] = raw.map((coin) => {
      const meta = COIN_META[coin.id] ?? { color: "#888", name: coin.name, symbol: coin.symbol.toUpperCase() };
      // Sparkline: CoinGecko gives ~168 hourly points — sample 7 daily
      const rawSparkline: number[] = coin.sparkline_in_7d?.price ?? [];
      const step = Math.floor(rawSparkline.length / 7) || 1;
      const sparkline = rawSparkline.length >= 7
        ? Array.from({ length: 7 }, (_, i) => rawSparkline[i * step] ?? rawSparkline[rawSparkline.length - 1])
        : mockSparkline(coin.current_price, coin.price_change_percentage_7d_in_currency ?? 0);

      return {
        id: coin.id,
        symbol: meta.symbol,
        name: meta.name,
        price: coin.current_price ?? 0,
        change24h: coin.price_change_percentage_24h ?? 0,
        change7d: coin.price_change_percentage_7d_in_currency ?? 0,
        marketCap: coin.market_cap ?? 0,
        volume24h: coin.total_volume ?? 0,
        sparkline,
        color: meta.color,
      };
    });

    // Añadir OMMY Coin (mock — no está en CoinGecko todavía)
    coins.push({
      id: "ommy-coin",
      symbol: "OMMY",
      name: "Ommy Coin",
      price: 0.001,
      change24h: 0,
      change7d: 0,
      marketCap: 2_997_924,    // ~$3M al lanzamiento
      volume24h: 0,
      sparkline: [0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001],
      color: "#8B5CF6",
      isOmmy: true,
    });

    cache = { data: coins, ts: Date.now() };
    return NextResponse.json(coins);
  } catch (err) {
    console.error("[Prices API]", err);

    // Fallback con datos mock si CoinGecko falla
    const fallback: CoinData[] = [
      { id: "bitcoin",       symbol: "BTC",  name: "Bitcoin",   price: 82000,  change24h:  1.2, change7d:  3.4, marketCap: 1_620_000_000_000, volume24h: 32_000_000_000, sparkline: [78000,79500,80200,81000,80500,81800,82000], color: "#F7931A" },
      { id: "ethereum",      symbol: "ETH",  name: "Ethereum",  price: 1820,   change24h: -0.8, change7d: -2.1, marketCap: 219_000_000_000,   volume24h:  9_000_000_000, sparkline: [1860,1845,1830,1810,1825,1815,1820],   color: "#627EEA" },
      { id: "avalanche-2",   symbol: "AVAX", name: "Avalanche", price: 18.5,   change24h:  2.1, change7d:  5.3, marketCap:   7_500_000_000,   volume24h:    400_000_000, sparkline: [17.2,17.8,18.0,17.6,18.1,18.3,18.5],   color: "#E84142" },
      { id: "ripple",        symbol: "XRP",  name: "XRP",       price: 2.14,   change24h: -1.3, change7d:  1.8, marketCap: 123_000_000_000,   volume24h:  5_000_000_000, sparkline: [2.05,2.08,2.12,2.10,2.15,2.13,2.14],   color: "#346AA9" },
      { id: "ommy-coin",     symbol: "OMMY", name: "Ommy Coin", price: 0.001,  change24h:  0,   change7d:  0,   marketCap:   2_997_924,       volume24h:              0, sparkline: [0.001,0.001,0.001,0.001,0.001,0.001,0.001], color: "#8B5CF6", isOmmy: true },
    ];
    return NextResponse.json(fallback);
  }
}
