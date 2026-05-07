// ─── OMMY Coin — Tokenomics Central ──────────────────────────────────────────
// Fuente única de verdad para toda la tokenomics del ecosistema Om Domo.
// Actualizado: Abril 2026 · Lanzamiento oficial: 21 Ago 2026
//
// Cambios v2:
//   · Burn objetivo: 90% → 70% (supply final ~9B, más sostenible para rewards)
//   · Pre-compra lock: 30 días → 21 Feb 2027 (6 meses post-launch)
//   · Burn schedule ligado a eventos cósmicos verificables
//   · Ecosystem release schedule con hitos trimestrales
//   · WALLET_DISTRIBUTION corregida: incluye Pre-compra 10% separado

// ─── Supply ──────────────────────────────────────────────────────────────────

export const SUPPLY = {
  initial:             29_979_245_800,  // OMMY total inicial
  final:                8_993_773_740,  // OMMY objetivo final (70% burn)
  burnTarget:          20_985_472_060,  // OMMY a quemar en total (70%)
  burnPercent:         70,              // % del supply a quemar
  alreadyBurned:        7_494_811_450,  // 25% — ya en 0x000...dEaD (permanente)
  remainingToBurn:     13_490_660_610,  // 45% más a quemar por mecánicas
  decimals:            18,
  // Supply circulante día 1 (solo liquidez DEX + pre-compra desbloqueada)
  // La pre-compra se desbloquea en Solsticio Invierno — NO el día del launch
  circulatingAtLaunch:  4_496_886_870,  // 15% — solo liquidez DEX el día 1
} as const;

// ─── Precio ───────────────────────────────────────────────────────────────────

export const PRICE = {
  launch:   0.001,  // USD por OMMY · 21 Ago 2026
  marketCapAtLaunch: 4_496_886_870 * 0.001,   // ~$4.5M (solo circulante real día 1)
  fdvAtLaunch: 29_979_245_800 * 0.001,         // ~$30M FDV total
} as const;

// Proyecciones de precio — escenario moderado
// Nota: son proyecciones basadas en hitos de usuarios, no garantías
export const PRICE_PROJECTION: Record<number, number> = {
  2026: 0.001,   // Lanzamiento — precio fijo pre-compra y launch
  2027: 0.005,   // ×5  — app Proof of Conscious Activity + staking
  2028: 0.015,   // ×15 — burn acelerado, DAO activo, Europa
  2029: 0.040,   // ×40 — adopción masiva, 200k usuarios
  2030: 0.100,   // ×100 — consolidación global, supply muy reducido
};

// ─── Calendario Cósmico — fechas estratégicas ────────────────────────────────
// Los eventos de Om Domo se sincronizan con los ciclos naturales.
// Cada hito está verificado en blockchain con tx pública.

export const COSMIC_CALENDAR = [
  {
    date:     "2026-02-14",
    label:    "San Valentín",
    event:    "Apertura Pre-compra Pública OMMY COIN",
    type:     "precompra",
    burn:     0,
    release:  0,
    desc:     "Amor propio + inversión consciente. Pre-compra abierta a la comunidad al precio de lanzamiento $0.001.",
  },
  {
    date:     "2026-03-20",
    label:    "Equinoccio de Primavera",
    event:    "Burn Ceremony #1 — Renacimiento",
    type:     "burn",
    burn:     500_000_000,     // 500M OMMY quemados
    release:  500_000_000,     // 500M OMMY distribuidos a early holders
    desc:     "El día en que la luz y la oscuridad se equilibran. Quema comunitaria + reward a early believers.",
  },
  {
    date:     "2026-08-21",
    label:    "Agosto ☀️",
    event:    "LANZAMIENTO OFICIAL Om Domo Web3",
    type:     "launch",
    burn:     5_000_000,       // 5M OMMY — Drop #1 Genesis Hoodie
    release:  0,
    desc:     "Lanzamiento oficial, Drop #1 Genesis Hoodie, liquidity DEX activada.",
  },
  {
    date:     "2026-08-12",
    label:    "Eclipse Solar",
    event:    "Eclipse Drop — Edición limitada 88 unidades",
    type:     "drop",
    burn:     5_000_000,
    release:  888_000,         // 888 OMMY a cada holder del Eclipse NFT
    desc:     "Evento único. Solo 88 NFTs Eclipse disponibles — energía de transformación.",
  },
  {
    date:     "2026-09-22",
    label:    "Equinoccio de Otoño",
    event:    "Drop #2 Solsticio + Burn Ceremony #2",
    type:     "burn",
    burn:     5_000_000,
    release:  1_000_000_000,   // 1B OMMY a stakers activos
    desc:     "Equilibrio y cosecha. Drop #2 Solsticio + reward a comunidad fiel.",
  },
  {
    date:     "2027-02-21",
    label:    "Invierno 2027 🌙",
    event:    "Pre-compra UNLOCK + Drop #3 Ommy Lab",
    type:     "unlock",
    burn:     5_000_000,
    release:  2_997_924_580,   // 10% pre-compra desbloqueado
    desc:     "Los early believers ven sus tokens liberados. Drop #3 Ommy Lab Vol.1.",
  },
  {
    date:     "2027-03-20",
    label:    "Equinoccio de Primavera",
    event:    "Burn Ceremony #3 + Launch App Proof of Conscious Activity",
    type:     "burn",
    burn:     2_000_000_000,
    release:  1_500_000_000,
    desc:     "App lanzada. Cada meditación, yoga y running genera OMMY. Burn masivo para marcar el hito.",
  },
  {
    date:     "2027-06-21",
    label:    "Solsticio de Verano — Aniversario",
    event:    "1 Año Om Domo — Burn Ceremony #4",
    type:     "burn",
    burn:     1_000_000_000,
    release:  500_000_000,     // reward a holders de 1 año
    desc:     "Un año de comunidad consciente. Quema del 1er aniversario + airdrop a holders fieles.",
  },
] as const;

// ─── Pre-compra — condiciones ─────────────────────────────────────────────────

export const PRECOMPRA = {
  price:          0.001,                // USD — mismo precio de lanzamiento
  totalOmmy:      2_997_924_580,        // 10% del supply total
  wallet:         "0x7c7cd287e3901888d29218b4fDe00C9c6Bc0F1e2",
  openDate:       "2026-02-14",         // San Valentín — apertura
  lockUntil:      "2027-02-21",         // 6 meses post-launch — unlock
  lockDays:       184,                  // ~6 meses post-launch
  cliff:          "2026-08-21",         // launch date (cliff)
  vestingType:    "cliff + linear",     // 1 cliff en launch, luego 6 meses lineal
  desc:           "Precio fijo $0.001. Tokens bloqueados hasta el 21 Feb 2027 (6 meses post-launch). Ideal para creyentes del proyecto desde el inicio.",
} as const;

// ─── Ecosystem Release Schedule — para inversores ────────────────────────────
// Transparencia total: calendario de distribución del wallet Ecosistema.
// Ninguna distribución fuera de estos hitos sin aprobación DAO.

export const ECOSYSTEM_SCHEDULE = [
  {
    date:     "2026-03-20",
    event:    "Equinoccio Primavera — Early Believers",
    ommy:     500_000_000,
    reason:   "Reward a compradores pre-launch y beta testers",
  },
  {
    date:     "2026-08-21",
    event:    "Launch — Drop #1 Genesis",
    ommy:     1_000_000_000,
    reason:   "Rewards de lanzamiento + compras Genesis Hoodie",
  },
  {
    date:     "2026-09-22",
    event:    "Equinoccio Otoño — Drop #2 + Stakers",
    ommy:     1_000_000_000,
    reason:   "Drop #2 Solsticio rewards + staking Q3 2026",
  },
  {
    date:     "2027-02-21",
    event:    "Invierno 2027 — Drop #3 + Comunidad",
    ommy:     1_000_000_000,
    reason:   "Drop #3 Ommy Lab + rewards Q4 2026",
  },
  {
    date:     "2027-03-20",
    event:    "App Launch — Proof of Conscious Activity",
    ommy:     2_000_000_000,
    reason:   "Rewards actividad física, meditación, yoga — Fase 3",
  },
  {
    date:     "2027-12-21",
    event:    "Solsticio Invierno 2027 — DAO Treasury",
    ommy:     1_500_000_000,
    reason:   "Transferencia a DAO para votación comunitaria",
  },
  // Resto (~3.5B) distribuido por DAO governance 2028+
] as const;

// ─── Rewards por acción ───────────────────────────────────────────────────────

export const OMMY_REWARD_RATE_PER_USD = 70;

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

export const BURN = {
  perPurchase:        500,       // OMMY quemados por cada compra física
  perTransaction:    0.02,       // 2% de cada transacción on-chain se quema
  perDropEvent: 5_000_000,       // OMMY quemados en batch por cada evento drop
  perSocialShare:      50,       // OMMY quemados al registrar un share
} as const;

// ─── Distribución de Wallets (CORREGIDA) ─────────────────────────────────────
// Total: 100% = 29,979,245,800 OMMY

export const WALLET_DISTRIBUTION = [
  { label: "Ecosistema & Recompensas", percent: 25, ommy:  7_494_811_450, color: "from-purple-500 to-pink-500",    wallet: "0xF49FBE7764932c5Ca95f0Da80F54C3C65C6ec294" },
  { label: "Quema permanente",         percent: 25, ommy:  7_494_811_450, color: "from-orange-500 to-red-500",     wallet: "0x000000000000000000000000000000000000dEaD" },
  { label: "Liquidez DEX",             percent: 15, ommy:  4_496_886_870, color: "from-cyan-500 to-blue-500",      wallet: "0x9EE85AE6D167bb5737aB85407088E766237Ed38a" },
  { label: "Pre-compra (lock→21Feb)",  percent: 10, ommy:  2_997_924_580, color: "from-amber-500 to-yellow-500",   wallet: "0x7c7cd287e3901888d29218b4fDe00C9c6Bc0F1e2" },
  { label: "Equipo (vesting 4 años)",  percent: 10, ommy:  2_997_924_580, color: "from-green-500 to-emerald-500",  wallet: "0xF8099E1cFc08FE7845188e5d77d70fedCd40802c" },
  { label: "Marketing & Partnerships", percent:  7, ommy:  2_098_547_206, color: "from-yellow-500 to-orange-500",  wallet: "0x1f1a22351F1CD24f5aaF70AA72F130Ec52Fa7c06" },
  { label: "DAO Treasury",             percent:  5, ommy:  1_498_962_290, color: "from-indigo-500 to-purple-500",  wallet: "0x6d7d88dBC7266Cfd9F5BF6B2324372eA9Cb70867" },
  { label: "Reserva Drops & Eventos",  percent:  3, ommy:    899_377_374, color: "from-pink-500 to-rose-500",      wallet: "0x15137EF263D78353458B57Bcb60b210AF4c827Bc" },
] as const;

// ─── Burn Schedule — ligado a eventos cósmicos ───────────────────────────────
// Cada burn ceremony se ejecuta on-chain con tx verificable públicamente.
// Supply acumulado restante después de cada evento.

export const BURN_SCHEDULE = [
  { date: "2026-03-20", event: "Equinoccio Primavera",        burned:    500_000_000, supplyEnd: 29_479_245_800, users:    500, burnPctAccum:  1.7, cosmicLabel: "🌸 Renacimiento" },
  { date: "2026-08-21", event: "Agosto — Launch",             burned:  5_000_000,     supplyEnd: 29_474_245_800, users:  2_000, burnPctAccum:  1.7, cosmicLabel: "☀️ Lanzamiento" },
  { date: "2026-08-12", event: "Eclipse Solar",               burned:  5_000_000,     supplyEnd: 29_469_245_800, users:  3_000, burnPctAccum:  1.7, cosmicLabel: "🌑 Eclipse" },
  { date: "2026-09-22", event: "Equinoccio Otoño",            burned:  5_000_000,     supplyEnd: 29_464_245_800, users:  4_000, burnPctAccum:  1.8, cosmicLabel: "🍂 Cosecha" },
  { date: "2027-02-21", event: "Invierno 2027 — Unlock",      burned:  5_000_000,     supplyEnd: 29_459_245_800, users:  5_000, burnPctAccum:  1.8, cosmicLabel: "🌙 Unlock" },
  { date: "2027-03-20", event: "Equinoccio Primavera",        burned:  2_000_000_000, supplyEnd: 27_459_245_800, users: 12_000, burnPctAccum:  8.5, cosmicLabel: "🌸 App Launch" },
  { date: "2027-06-21", event: "Solsticio Verano Aniversario",burned:  1_000_000_000, supplyEnd: 26_459_245_800, users: 18_000, burnPctAccum: 11.8, cosmicLabel: "☀️ 1 Año" },
  { date: "2027-09-22", event: "Equinoccio Otoño",            burned:  1_500_000_000, supplyEnd: 24_959_245_800, users: 30_000, burnPctAccum: 16.8, cosmicLabel: "🍂 Expansión" },
  { date: "2027-12-21", event: "Solsticio Invierno",          burned:  1_500_000_000, supplyEnd: 23_459_245_800, users: 45_000, burnPctAccum: 21.8, cosmicLabel: "🌙 DAO" },
  { date: "2028-06-21", event: "Solsticio Verano",            burned:  3_000_000_000, supplyEnd: 20_459_245_800, users: 80_000, burnPctAccum: 31.8, cosmicLabel: "☀️ Escasez" },
  { date: "2028-12-21", event: "Solsticio Invierno",          burned:  3_000_000_000, supplyEnd: 17_459_245_800, users:150_000, burnPctAccum: 41.8, cosmicLabel: "🌙 Madurez" },
  { date: "2029-06-21", event: "Solsticio Verano",            burned:  4_000_000_000, supplyEnd: 13_459_245_800, users:250_000, burnPctAccum: 55.2, cosmicLabel: "☀️ Europa" },
  { date: "2029-12-21", event: "Solsticio Invierno",          burned:  4_000_000_000, supplyEnd:  9_459_245_800, users:350_000, burnPctAccum: 68.6, cosmicLabel: "🌙 Global" },
  { date: "2030-06-21", event: "Solsticio Verano — Final",    burned:    465_472_060, supplyEnd:  8_993_773_740, users:500_000, burnPctAccum: 70.0, cosmicLabel: "☀️ Supply Final" },
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

// Próximo evento cósmico desde hoy
export function getNextCosmicEvent(): typeof COSMIC_CALENDAR[number] | null {
  const today = new Date().toISOString().slice(0, 10);
  return COSMIC_CALENDAR.find((e) => e.date >= today) ?? null;
}
