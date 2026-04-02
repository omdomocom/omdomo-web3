# Om Domo Web3 — CLAUDE.md

Contexto completo del proyecto para sesiones de Claude Code.
**Siempre responde en español.**

## Visión del Proyecto

"Spiritual Web3 Lifestyle Ecosystem" — Lululemon + Stepn + DAO espiritual + NFT art.
- Website: omdomo.com (Shopify activo)
- Web3 app: web3.omdomo.com (Vercel — Next.js)
- Token: Ommy Coin en Avalanche Mainnet
- **Lanzamiento oficial: Junio 2026**
- Stack: Next.js 15.3.9 (App Router) + Thirdweb v5 + Claude API + Tailwind CSS

## Wallets

| Rol | Dirección |
|-----|-----------|
| Owner / Holder Ommy Coin | `0x15Eb18b12979AD8a85041423df4C92de6EF186f9` |
| Deployer / Minter (server minter Fuji) | `0x648FD67c26E607324B860d95b2ee8834EE30b146` |
| Deployer Thirdweb managed | `0x54E50e0eF3B690735161508374a4c5967AF49707` |

## Contratos On-Chain

| Contrato | Red | Dirección |
|----------|-----|-----------|
| Ommy Coin (ERC-20) | Avalanche Mainnet (43114) | `0x70EdA9Bb95eeE2551261c37720933905f9425596` |
| Om Domo NFT (ERC-1155) | Avalanche Fuji Testnet (43113) | `0xd51de87FbC012b694922036C30E5C82e16594958` |
| Om Domo NFT (ERC-1155) | Avalanche Mainnet (43114) | ⏳ Pendiente migración |

- Ommy Coin symbol: OMMY | Decimals: 18
- NFT symbol: OMDNFT | Type: Edition Drop ERC-1155 v5.0.7
- Thirdweb contract ID (Ommy Coin): `02022bf596bb27cee6e3ac22132b4313`

## Variables de Entorno (.env.local)

```
ANTHROPIC_API_KEY=                    # Claude API — agentes AI
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=       # Thirdweb client ID
THIRDWEB_SECRET_KEY=                  # Thirdweb secret (server only)
NEXT_PUBLIC_OMMY_COIN_ADDRESS=        # 0x70EdA9Bb95eeE2551261c37720933905f9425596
NEXT_PUBLIC_OWNER_WALLET=             # 0x15Eb18b12979AD8a85041423df4C92de6EF186f9
NEXT_PUBLIC_NFT_CONTRACT_FUJI=        # 0xd51de87FbC012b694922036C30E5C82e16594958
NEXT_PUBLIC_NFT_CONTRACT_MAINNET=     # ⏳ Pendiente
MINTER_PRIVATE_KEY=                   # Private key del minter wallet (0x648FD67...)
SHOPIFY_WEBHOOK_SECRET=               # HMAC secret del webhook Shopify
RESEND_API_KEY=                       # Resend para emails transaccionales
EMAIL_FROM=                           # "Om Domo <noreply@omdomo.com>"
NEXT_PUBLIC_APP_URL=                  # https://web3.omdomo.com
NEXT_PUBLIC_USE_MAINNET=false         # true = usa mainnet NFT
REDIS_URL=                            # redis://... — Redis Cloud (claims persistentes)
```

## Infraestructura Producción

| Servicio | Estado | URL / Info |
|---------|--------|------------|
| Vercel | ✅ Live | web3.omdomo.com |
| Redis Cloud | ✅ Conectado | redis-18598.c59.eu-west-1-2.ec2.cloud.redislabs.com |
| Resend | ✅ Verificado | omdomo.com verificado, envía desde noreply@omdomo.com |
| Shopify Webhook | ✅ Configurado | Pago de pedido → web3.omdomo.com/api/shopify/webhook |
| GitHub | ✅ Conectado | github.com/omdomocom/omdomo-web3 (auto-deploy en push a main) |

## Comunidad

- Discord: https://discord.gg/xXezFXnpaX
- Instagram: instagram.com/om.domo
- TikTok: tiktok.com/@omdomo.com
- Twitter/X: twitter.com/omdomocom
- YouTube: youtube.com/@omdomocom

## Estructura de Archivos

```
public/
├── logo-negro.png                    # Logo Om Domo original (negro sobre blanco)
└── logo-blanco.png                   # Logo invertido para uso sobre fondos oscuros

src/
├── app/
│   ├── page.tsx                      # Root: LandingPage pública + Dashboard dinámico
│   ├── layout.tsx                    # ThirdwebProvider + Playfair Display font + metadata
│   ├── globals.css                   # Tailwind + sistema dual dark/cream + shimmer-omdomo
│   ├── claim/page.tsx                # Página claim NFT (dynamic import)
│   ├── drops/page.tsx                # Página drops con countdown
│   └── api/
│       ├── agent/route.ts            # Multi-agent Claude API (coordinator + 5 agentes)
│       ├── shopify/webhook/route.ts  # Webhook Shopify → crea claim + envía email
│       ├── nft/
│       │   ├── approve-claim/route.ts
│       │   ├── mint/route.ts
│       │   ├── confirm-claimed/route.ts
│       │   └── check-claim/route.ts
│       ├── share/route.ts            # Share-to-earn (+500 OMMY Twitter/IG)
│       └── burn/stats/route.ts       # Estadísticas de burn dinámicas
├── components/
│   ├── LandingPage.tsx               # Landing pública completa (ver secciones abajo)
│   ├── Dashboard.tsx                 # Layout 3 columnas (Wallet|Chat|Roadmap)
│   ├── ChatInterface.tsx             # Chat con Coordinator AI
│   ├── AgentsPanel.tsx               # Lista de 5 agentes especializados
│   ├── AgentCard.tsx                 # Card individual de agente
│   ├── WalletPanel.tsx               # Connect wallet + balance OMMY
│   ├── RoadmapPanel.tsx              # 5 fases del roadmap
│   ├── TokenomicsPanel.tsx           # Stats live de tokenomics
│   ├── ClaimPageClient.tsx           # Flow 4 pasos: lookup→connect→mint→share
│   ├── SpaceBackground.tsx           # Canvas: estrellas interactivas + gravedad cursor
│   └── TestPurchasePanel.tsx         # Dev-only: simula compra Shopify
├── lib/
│   ├── thirdweb.ts                   # Clientes Thirdweb + getOmmyContract()
│   ├── nft.ts                        # getNFTContract() + rarity system
│   ├── claims.ts                     # Redis (ioredis) + fallback in-memory
│   ├── tokenomics.ts                 # Fuente única de verdad tokenomics
│   ├── email.ts                      # Resend email (lazy init)
│   └── agents/definitions.ts        # System prompts de todos los agentes
└── types/
    └── agents.ts                     # AgentResponse, CoordinatorResult
```

## Páginas (rutas)

| Ruta | Descripción |
|------|-------------|
| `/` | Landing pública + Hero animado |
| `/nft` | Colección NFT completa — rareza, 4 tipos (carrusel), Guardianes (carrusel), countdown |
| `/claim` | Claim NFT tras compra — lookup por Order ID o email |
| `/drops` | Drops limitados con countdown a Junio 2026 |
| `/dashboard` | Dashboard 3 columnas: Wallet + Chat AI + Roadmap |

## Componentes internos de LandingPage.tsx

```
HeroLogo             # Logo Om Domo 164px + anillos ripple + glow pulsante + badge "Web3 Ecosystem"
OmDomoLogo           # Logo pequeño reutilizable (nav, footer) con prop showStars
DonutChart           # SVG puro — distribución supply tokenomics
SocialsCarousel      # Carrusel infinito Framer Motion con logos oficiales RRSS
EcosistemaSection    # 6 nodos interactivos (Tienda, NFTs, OMMY, DAO, dApp, DEX)
PreCompraSection     # Sección pre-compra OMMY (10% supply, lock 30d)
ProyectosSustentables  # 6 cards: moda sostenible, ropa reciclada, CO2, etc.
GuiasWeb3Accordion   # Accordion integrado en "Cómo funciona": wallet, glosario, dashboard
ComunidadDev         # GitHub + Discord + feedback form
```

## Componentes de /nft (src/app/nft/page.tsx)

```
HolographicCard      # Carta NFT 3D interactiva (mouse tilt + glow)
NFTTypeCard          # Card de tipo NFT (Genesis/Founder/Community/Standard)
GuardianCard         # Card Guardián de la Conciencia (hover reveal)
ScrollCarousel       # Carrusel con scroll-snap + botones prev/next + dots activos
Countdown            # Countdown live hasta Jun 2026
```

## Secciones Landing (web3.omdomo.com) — Estado

```
✅ Hero             — SpaceBackground canvas + HeroLogo + "Om Domo" shimmer+float + badge testnet
✅ Stats bar        — contadores animados
✅ Cómo funciona    — 3 pasos (cream) + Guías Web3 accordion integrado al final
✅ Rewards          — gamificación multi-plataforma (Twitter, TikTok, Instagram, Threads)
✅ Tokenomics       — DonutChart SVG + mecánicas de burn
✅ NFT teaser       — pills rareza + preview 3 Guardianes + CTA → /nft
✅ Pre-compra OMMY  — 10% supply, lock 30d, explicación del mecanismo
✅ Ecosistema       — 6 nodos interactivos (dark): Tienda, NFTs, OMMY, DAO, dApp, DEX
✅ Proyectos Sustentables — 6 cards (cream)
✅ Testnet Fuji     — dark
✅ Comunidad + RRSS — carrusel logos oficiales + ComunidadDev (cream)
✅ Waitlist         — form email (cream)
✅ Footer           — dark, logo real, redes sociales

## Página /nft (web3.omdomo.com/nft) — Estado

✅ Hero             — HolographicCard 3D + 6 beneficios NFT
✅ Sistema rareza   — 4 tiers con barras progress + gradient visual
✅ 4 tipos NFT      — ScrollCarousel draggable (Genesis/Founder/Community/Standard)
✅ Guardianes       — ScrollCarousel draggable (6 arquetipos, hover reveal, countdown)
✅ Footer           — links a Inicio, Drops, Reclamar, Tienda
```

⏳ Pre-compra:      Mecanismo de pago real (actualmente informacional)
⏳ Referral system  on-chain (Fase 2)
⏳ Staking NFT      50 OMMY/día (Fase 2)

## Design System

- **Tema dual**: secciones dark (`--dark-bg: #0c0906`) + cream (`--cream-bg: #f5f0e8`)
- **Tipografía**: Playfair Display (serif) via `next/font` + system sans-serif
- **Clases clave**: `.section-dark`, `.section-cream`, `.glass`, `.glass-light`, `.gradient-text`, `.gradient-text-gold`, `.card-cream-hover`
- **Animación shimmer**: `.shimmer-omdomo` — sweep de luz sobre "Om Domo" en hero
- **SpaceBackground**: canvas con gravedad en cursor, drift orgánico, estrellas fugaces

## Claims — Redis Schema

```
claim:{id}              → JSON del Claim completo
order-index:{orderId}   → array de claim IDs por orden Shopify
email-index:{email}     → array de claim IDs por email
```

Fallback: si `REDIS_URL` no está configurado → usa Map en memoria con warning en consola.

## Tokenomics Ommy Coin

| Parámetro | Valor |
|-----------|-------|
| Supply inicial | 29,979,245,800 OMMY |
| Supply final (objetivo) | 2,997,924,580 OMMY (90% burn en ~7-8 años) |
| Precio lanzamiento | $0.001 |
| Market Cap lanzamiento | ~$3M |
| FDV | ~$30M |
| Rate rewards | **70 OMMY por USD gastado** |

### Distribución Supply (CONFIRMADA)
| Segmento | % | OMMY aprox |
|----------|---|-----------|
| Ecosistema & Rewards | 25% | ~7.49M |
| Pre-compra (lock 30d) | 10% | ~3.00M |
| Quema programada | 25% | ~7.49M |
| Liquidez DEX | 15% | ~4.50M |
| Equipo (4yr vesting) | 10% | ~3.00M |
| Marketing | 7% | ~2.10M |
| DAO Treasury | 5% | ~1.50M |
| Reserva Drops | 3% | ~0.90M |

**Mensaje clave: "60% del supply enfocado en comunidad y sostenibilidad del token"**

### Mecánicas de Burn
- Por compra: 500 OMMY + 2% de los rewards distribuidos
- Por drop: 5,000,000 OMMY por evento
- Por share social: 50 OMMY

### Sistema de Rewards
| Acción | Reward |
|--------|--------|
| Compra física | 70 OMMY × USD |
| NFT claim bonus | +1,000 OMMY |
| Share Twitter/IG | +500 OMMY cada una |
| Referido | +2,000 OMMY cuando compra |
| Limited drop (1ª hora) | +10,000 OMMY |
| Staking NFT | 50 OMMY/día |
| DAO vote | +200 OMMY |
| Evento Om Domo | +3,000 OMMY |

### Proyección de Precio
$0.003 (2026) → $0.01 (2027) → $0.035 (2028) → $0.10 (2029) → $0.25 (2030)

## NFT Rarity System

| Rarity | Ventana |
|--------|---------|
| Genesis | Antes del lanzamiento oficial (Jun 2026) — máxima rareza |
| Founder | Primer mes post-lanzamiento |
| Community | Primeros 3 meses |
| Standard | Después |

## Equipo de Agentes AI

API: Claude (claude-opus-4-6) — `src/lib/agents/definitions.ts`

| Agente | Especialidad |
|--------|-------------|
| Om Domo Coordinator | Dirige, prioriza, sintetiza |
| Web3 Architect | Avalanche, contratos, thirdweb, staking |
| Product Strategist | Ventas Shopify+Web3, NFTs, funnels |
| App Builder | App Proof of Conscious Activity |
| Community Architect | DAO, Discord/Telegram, ambassadors |
| Creative Director | NFT art, fashion, drops |

Flow: `POST /api/agent` → selectAgents() → callAgent() en paralelo → coordinatorSynthesize()

## Roadmap 5 Fases

| Fase | Nombre | Fecha | Estado |
|------|--------|-------|--------|
| 1 | Motor de Ventas | Jun 2026 | **ACTIVA** |
| 2 | Economía Ommy Coin | Sep 2026 | Pendiente |
| 3 | App Proof of Conscious Activity | Ene 2027 | Pendiente |
| 4 | Comunidad DAO | Jun 2027 | Pendiente |
| 5 | Ommy Lab | 2028+ | Pendiente |

## Drops Planificados

| Drop | Unidades | Precio | OMMY Bonus | Burn | Fecha |
|------|----------|--------|------------|------|-------|
| #1 Genesis Hoodie | 100 | €89 | 10,000 OMMY | 5M OMMY | Jun 2026 |
| #2 Solsticio | 50 | TBD | TBD | 5M OMMY | Sep 2026 |
| #3 Ommy Lab Vol.1 | 200 | TBD | TBD | 5M OMMY | Dic 2026 |

## Implementado ✅

- Landing pública con 12 secciones (dark/cream dual theme, GSAP, Framer Motion)
- Página `/nft` completa — rareza, 4 tipos NFT + Guardianes en carrusel (ScrollCarousel)
- `ScrollCarousel`: scroll-snap nativo + prev/next arrows + dots activos animados
- `EcosistemaSection`: 6 nodos interactivos con sub-contenido específico por nodo
  - DAO: progress tracker visual 5 fases + links GitHub/Discord
  - dApp: grid 8 actividades (Running, Yoga, Ciclismo, Natación, Patines, Meditación, Arte→NFT, Música)
  - DEX: Trader Joe / Pangolin / Uniswap con incentivos
- Gamificación multi-plataforma: Twitter/X, TikTok, Instagram, Threads (+500 OMMY c/u)
- Reto combinado Meditación+Running con bonus OMMY
- Guías Web3 integradas en sección "Cómo funciona" (accordion compacto)
- Logo real Om Domo — `public/logo-negro.png` + `public/logo-blanco.png`
- `HeroLogo`: anillos ripple + glow pulsante + badge "Web3 Ecosystem"
- `SpaceBackground`: canvas interactivo con gravedad cursor + estrellas fugaces
- `DonutChart`: SVG puro para distribución supply
- `SocialsCarousel`: carrusel infinito Framer Motion (6 redes sociales)
- `.shimmer-omdomo` + float animation sobre "Om Domo" en hero
- Redis Cloud (ioredis) — claims persistentes con fallback in-memory
- Email automático via Resend al cliente tras cada compra
- Shopify webhook: Pago de pedido → mint NFT → email
- Claim page `/claim` — flow 4 pasos: lookup → connect wallet → mint → share
- Share-to-earn `/api/share` (+500 OMMY por red social)
- Drops page `/drops` con countdown a Junio 2026
- NFT rarity system (Genesis/Founder/Community/Standard)
- `src/lib/tokenomics.ts` — fuente única de verdad tokenomics
- TestPurchasePanel dev-only (NODE_ENV=development)
- Next.js 15.3.9 — parcheado CVE-2025-6647
- GitHub → Vercel auto-deploy en push a main
- Discord URL: https://discord.gg/xXezFXnpaX

## Pendiente para Lanzamiento ⏳

- Migrar NFT contract Fuji → Avalanche Mainnet
- `NEXT_PUBLIC_NFT_CONTRACT_MAINNET` + `NEXT_PUBLIC_USE_MAINNET=true`
- Crear producto Drop #1 Genesis en Shopify (100 hoodies, €89)
- Probar flujo completo end-to-end con compra real
- Rotar THIRDWEB_SECRET_KEY
- Pre-compra: implementar mecanismo de pago real (actualmente informacional)
- Referral system on-chain (Fase 2)
- Staking NFT 50 OMMY/día (Fase 2)

## Convenciones de Código

- **TypeScript strict** — no `any` sin justificación
- **Thirdweb v5** — siempre usar `prepareContractCall`, `sendTransaction`, `useReadContract`
- **SSR safety** — cualquier componente con Thirdweb: `"use client"` + `dynamic(..., {ssr: false})`
- **Tailwind dual theme** — usar variables CSS (`var(--dark-bg)`, `var(--cream-bg)`) + clases `.section-dark` / `.section-cream`
- **Agentes en español** — todos los system prompts y respuestas en español
- **Claims async** — todas las funciones de claims son async (Redis)
- Burn amounts siempre usar `BigInt()` no literales `1n` (compatibilidad ES target)
- Resend: lazy init con `getResend()` — retorna null si no hay API key (no rompe build)
- Imágenes locales desde `/public/` usando `next/image` con `priority` en hero

## Mercado Objetivo

España 18-35 años, deportivo + wellness + crypto-curious.
Target: 200 (beta 2025) → 2,000 (2026) → 12,000 (2027) → 55,000 (2028)
Potencial real años 1-2: 26,000 personas España × 4 Europa = ~104,000
