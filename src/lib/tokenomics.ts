// ─── OMMY Coin — Tokenomics Central ──────────────────────────────────────────
// Fuente única de verdad para toda la tokenomics del ecosistema Om Domo.
// Actualizado: Marzo 2026 · Lanzamiento objetivo: Junio 2026

// ─── Supply ──────────────────────────────────────────────────────────────────

export const SUPPLY = {
  initial:        29_979_245_800,   // OMMY total inicial
  final:           2_997_924_580,   // OMMY objetivo final (90% burn)
  burnTarget:     26_981_321_220,   // OMMY a quemar en total
  burnPercent:    90,               // % del supply a quemar
  decimals:       18,
  // Supply circulante en lanzamiento: 10% desbloqueado
  circulatingAtLaunch: 2_997_924_580,
} as const;

// ─── Precio ───────────────────────────────────────────────────────────────────

export const PRICE = {
  launch:   0.001,  // USD por OMMY en lanzamiento (Junio 2026)
  // Market cap al lanzamiento: circulante × precio
  marketCapAtLaunch: 2_997_924_580 * 0.001, // ~$3M
  // Fully Diluted Valuation al lanzamiento
  fdvAtLaunch: 29_979_245_800 * 0.001,       // ~$30M
} as const;

// Proyecciones conservadoras de precio por año
export const PRICE_PROJECTION: Record<number, number> = {
  2025: 0.001,   // Lanzamiento
  2026: 0.003,   // ×3 — comunidad creciendo
  2027: 0.010,   // ×10 — app Proof of Conscious Activity lanzada
  2028: 0.035,   // ×35 — burn acelerado, DAO activo
  2029: 0.100,   // ×100 — adopción masiva Europa
  2030: 0.250,   // ×250 — consolidación global
};

// ─── Rewards por acción ───────────────────────────────────────────────────────

// Rate base: 70 OMMY por USD gastado → hoodie €70 ≈ $76 ≈ 5,320 OMMY (~$5.32 en lanzamiento)
export const OMMY_REWARD_RATE_PER_USD = 70;

// Rewards fijos por tipo de acción
export const REWARDS = {
  purchaseRatePerUSD:  70,       // OMMY por dólar gastado en compra física
  claimNFT:         1_000,       // OMMY extra por reclamar el NFT
  shareTwitter:       500,       // OMMY por compartir en Twitter/X
  shareInstagram:     500,       // OMMY por compartir en IG
  referralFriend:   2_000,       // OMMY cuando un referido hace su primera compra
  dailyMeditation:     50,       // OMMY por 20+ min meditación verificada
  weeklyYoga:         200,       // OMMY por sesión yoga verificada
  running5km:         250,       // OMMY por cada 5km running verificado
  stakingPerDay:       50,       // OMMY por día de staking NFT
  daoVote:            200,       // OMMY por participar en votación DAO
  attendEvent:      3_000,       // OMMY por asistir a evento Om Domo
  limitedDrop1h:   10_000,       // OMMY si compras en la primera hora de un drop
} as const;

// ─── Burn por acción ─────────────────────────────────────────────────────────

// Cada compra física quema OMMY adicional (además del gas)
export const BURN = {
  perPurchase:        500,       // OMMY quemados por cada compra física
  perTransaction:    0.02,       // 2% de cada transacción on-chain se quema
  perDropEvent: 5_000_000,       // OMMY quemados en batch por cada evento drop
  perSocialShare:      50,       // OMMY quemados al registrar un share
} as const;

// ─── Distribución de Wallets ─────────────────────────────────────────────────

export const WALLET_DISTRIBUTION = [
  { label: "Ecosistema & Recompensas", percent: 35, ommy: 10_492_736_030, color: "from-purple-500 to-pink-500" },
  { label: "Quema programada",         percent: 25, ommy:  7_494_811_450, color: "from-orange-500 to-red-500" },
  { label: "Liquidez DEX",             percent: 15, ommy:  4_496_886_870, color: "from-cyan-500 to-blue-500" },
  { label: "Equipo (vesting 4 años)",  percent: 10, ommy:  2_997_924_580, color: "from-green-500 to-emerald-500" },
  { label: "Marketing & Partnerships", percent:  7, ommy:  2_098_547_206, color: "from-yellow-500 to-orange-500" },
  { label: "DAO Treasury",             percent:  5, ommy:  1_498_962_290, color: "from-indigo-500 to-purple-500" },
  { label: "Reserva drops & eventos",  percent:  3, ommy:    899_377_374, color: "from-pink-500 to-rose-500" },
] as const;

// ─── Plan de quema por año ────────────────────────────────────────────────────

export const BURN_SCHEDULE = [
  { year: 2025, burned: 1_000_000_000, supplyEnd: 28_979_245_800, users:     200, burnPctAccum:  3.3 },
  { year: 2026, burned: 2_500_000_000, supplyEnd: 26_479_245_800, users:   2_000, burnPctAccum: 11.7 },
  { year: 2027, burned: 4_000_000_000, supplyEnd: 22_479_245_800, users:  12_000, burnPctAccum: 25.0 },
  { year: 2028, burned: 5_500_000_000, supplyEnd: 16_979_245_800, users:  55_000, burnPctAccum: 43.4 },
  { year: 2029, burned: 7_000_000_000, supplyEnd:  9_979_245_800, users: 200_000, burnPctAccum: 66.7 },
  { year: 2030, burned: 5_000_000_000, supplyEnd:  4_979_245_800, users: 400_000, burnPctAccum: 83.4 },
  { year: 2031, burned: 1_981_321_220, supplyEnd:  2_997_924_580, users: 500_000, burnPctAccum: 90.0 },
] as const;

// ─── Mercado objetivo ────────────────────────────────────────────────────────

export const TARGET_MARKET = {
  spain: {
    population1835: 11_750_000,
    sportsWellness: 3_500_000,   // 30% interesados en deporte/bienestar
    cryptoCurious:    525_000,   // 15% de ese segmento
    omDomoPotential:   26_000,   // 5% convertibles (moda + crypto + wellness)
  },
  europeMultiplier: 4,           // España × 4 = ~104,000 personas en años 1-3
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function calculateOmmyReward(orderTotalUSD: number): number {
  return Math.floor(orderTotalUSD * OMMY_REWARD_RATE_PER_USD);
}

export function calculateBurnAmount(orderTotalUSD: number): number {
  const reward = calculateOmmyReward(orderTotalUSD);
  return BURN.perPurchase + Math.floor(reward * BURN.perTransaction);
}

export function estimateOmmyValueUSD(ommyAmount: number, year = 2026): number {
  const price = PRICE_PROJECTION[year] ?? PRICE.launch;
  return ommyAmount * price;
}

export function getCurrentBurnPercent(totalBurned: number): number {
  return (totalBurned / SUPPLY.burnTarget) * 100;
}
