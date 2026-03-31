# Om Domo Web3 — CLAUDE.md

Contexto completo del proyecto para sesiones de Claude Code.
**Siempre responde en español.**

## Visión del Proyecto

"Spiritual Web3 Lifestyle Ecosystem" — Lululemon + Stepn + DAO espiritual + NFT art.
- Website: omdomo.com (Shopify ya activo)
- Token: Ommy Coin en Avalanche Mainnet
- **Lanzamiento oficial: Junio 2026**
- Stack: Next.js 16 (App Router) + Thirdweb v5 + Claude API + Tailwind CSS

## Wallets

| Rol | Dirección |
|-----|-----------|
| Owner / Holder Ommy Coin | `0x15Eb18b12979AD8a85041423df4C92de6EF186f9` |
| Deployer / Minter (Thirdweb managed) | `0x54E50e0eF3B690735161508374a4c5967AF49707` |

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
MINTER_PRIVATE_KEY=                   # Private key del deployer wallet
SHOPIFY_WEBHOOK_SECRET=               # HMAC secret del webhook Shopify
RESEND_API_KEY=                       # Resend para emails transaccionales
EMAIL_FROM=                           # "Om Domo <noreply@omdomo.com>"
NEXT_PUBLIC_USE_MAINNET=false         # true = usa mainnet NFT
KV_REST_API_URL=                      # ⏳ Upstash KV (claims persistentes)
KV_REST_API_TOKEN=                    # ⏳ Upstash KV token
```

## Estructura de Archivos

```
src/
├── app/
│   ├── page.tsx                          # Root: "use client" + dynamic(Dashboard, {ssr:false})
│   ├── layout.tsx                        # ThirdwebProvider + metadata
│   ├── globals.css                       # Tailwind + glass/gradient-text classes
│   ├── claim/page.tsx                    # Página claim NFT (dynamic import)
│   ├── drops/page.tsx                    # Página drops con countdown
│   └── api/
│       ├── agent/route.ts                # Multi-agent Claude API (coordinator + 5 agentes)
│       ├── shopify/webhook/route.ts      # Webhook Shopify → crea claim record
│       ├── nft/
│       │   ├── approve-claim/route.ts    # Valida claim + linkea wallet
│       │   ├── mint/route.ts             # Server-side mint (fallback dev)
│       │   ├── confirm-claimed/route.ts  # Registra txHash post-mint
│       │   └── check-claim/route.ts     # GET claim por orderId o email
│       ├── share/route.ts                # Share-to-earn (+500 OMMY Twitter/IG)
│       └── burn/stats/route.ts           # Estadísticas de burn dinámicas
├── components/
│   ├── Dashboard.tsx                     # Layout 3 columnas (Wallet|Chat|Roadmap)
│   ├── ChatInterface.tsx                 # Chat con Coordinator AI
│   ├── AgentsPanel.tsx                   # Lista de 5 agentes especializados
│   ├── AgentCard.tsx                     # Card individual de agente
│   ├── WalletPanel.tsx                   # Connect wallet + balance OMMY
│   ├── RoadmapPanel.tsx                  # 5 fases del roadmap
│   ├── TokenomicsPanel.tsx               # Stats live de tokenomics
│   ├── ClaimPageClient.tsx               # Flow 4 pasos: lookup→connect→mint→share
│   └── TestPurchasePanel.tsx             # Dev-only: simula compra Shopify
├── lib/
│   ├── thirdweb.ts                       # Clientes Thirdweb + getOmmyContract()
│   ├── nft.ts                            # getNFTContract() + rarity system
│   ├── claims.ts                         # In-memory claims store (Map)
│   ├── tokenomics.ts                     # Fuente única de verdad tokenomics
│   ├── email.ts                          # Resend email (lazy init)
│   └── agents/definitions.ts            # System prompts de todos los agentes
└── types/
    └── agents.ts                         # AgentResponse, CoordinatorResult
```

## Tokenomics Ommy Coin

| Parámetro | Valor |
|-----------|-------|
| Supply inicial | 29,979,245,800 OMMY |
| Supply final (objetivo) | 2,997,924,580 OMMY (90% burn en ~7-8 años) |
| Precio lanzamiento | $0.001 |
| Market Cap lanzamiento | ~$3M |
| FDV | ~$30M |
| Rate rewards | **70 OMMY por USD gastado** |

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

### Distribución Wallets
35% Ecosistema & Rewards | 25% Quema programada | 15% Liquidez DEX
10% Equipo (4yr vesting) | 7% Marketing | 5% DAO Treasury | 3% Drops

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

| Agente | ID | Especialidad |
|--------|-----|-------------|
| Om Domo Coordinator | (COORDINATOR_SYSTEM_PROMPT) | Dirige, prioriza, sintetiza |
| Web3 Architect | `web3Architect` | Avalanche, contratos, thirdweb, staking |
| Product Strategist | `productStrategist` | Ventas Shopify+Web3, NFTs, funnels |
| App Builder | `appBuilder` | App Proof of Conscious Activity |
| Community Architect | `communityArchitect` | DAO, Discord/Telegram, ambassadors |
| Creative Director | `creativeDirector` | NFT art, fashion, drops |

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

- Shopify webhook → crea claim record + envía email
- Claim page `/claim` — flow 4 pasos: lookup → connect wallet → mint client-side → share
- Share-to-earn `/api/share` (+500 OMMY por Twitter/IG)
- Burn stats `/api/burn/stats`
- Drops page `/drops` con countdown a Junio 2026
- TokenomicsPanel en dashboard (sidebar derecho)
- NFT rarity system (Genesis/Founder/Community/Standard) en metadata
- `src/lib/tokenomics.ts` — fuente única de verdad tokenomics
- TestPurchasePanel dev-only (NODE_ENV=development)
- Agentes actualizados en español con contexto completo

## Pendiente para Lanzamiento ⏳

- `MINTER_PRIVATE_KEY` configurada y verificada en .env.local
- Migrar NFT contract Fuji → Avalanche Mainnet
- `NEXT_PUBLIC_NFT_CONTRACT_MAINNET` + `NEXT_PUBLIC_USE_MAINNET=true`
- `SHOPIFY_WEBHOOK_SECRET` configurado en Shopify Partners
- Deploy a producción (Vercel) para que Shopify alcance el webhook
- Crear producto Drop #1 Genesis en Shopify (100 hoodies, €89)
- Referral system on-chain (Fase 2)
- Staking NFT 50 OMMY/día (Fase 2)
- KV_REST_API_URL / KV_REST_API_TOKEN (Upstash) para claims persistentes

## Convenciones de Código

- **TypeScript strict** — no `any` sin justificación
- **Thirdweb v5** — siempre usar `prepareContractCall`, `sendTransaction`, `useReadContract`
- **SSR safety** — cualquier componente con Thirdweb: `"use client"` + `dynamic(..., {ssr: false})`
- **Tailwind dark theme** — fondo `bg-background` (slate-950), glass con `backdrop-blur`
- **Agentes en español** — todos los system prompts y respuestas en español
- **Claims store** — actualmente in-memory (Map). Para producción: migrar a Upstash KV
- Burn amounts siempre usar `BigInt()` no literales `1n` (compatibilidad ES target)
- Resend: lazy init con `getResend()` — retorna null si no hay API key (no rompe build)

## Mercado Objetivo

España 18-35 años, deportivo + wellness + crypto-curious.
Target: 200 (beta 2025) → 2,000 (2026) → 12,000 (2027) → 55,000 (2028)
Potencial real años 1-2: 26,000 personas España × 4 Europa = ~104,000
