# Om Domo Web3 — CLAUDE.md

Contexto completo del proyecto para sesiones de Claude Code.
**Siempre responde en español.**

## Visión del Proyecto

"Spiritual Web3 Lifestyle Ecosystem" — Lululemon + Stepn + DAO espiritual + NFT art.
- Website: omdomo.com (Shopify activo)
- Web3 app: web3.omdomo.com (Vercel — Next.js)
- Token: Ommy Coin en Avalanche Mainnet
- **Lanzamiento oficial: Junio 2026**
- Stack: Next.js 15.3.9 (App Router) + Thirdweb v5 + Claude API + Tailwind CSS + shadcn/ui

## Wallets

### Operativas
| Rol | Dirección |
|-----|-----------|
| Owner / Holder Ommy Coin | `0x15Eb18b12979AD8a85041423df4C92de6EF186f9` |
| Deployer / Minter (server minter Fuji) | `0x648FD67c26E607324B860d95b2ee8834EE30b146` |
| Deployer Thirdweb managed | `0x54E50e0eF3B690735161508374a4c5967AF49707` |
| NFTs / Personal MetaMask | `0xF7B9Ca5A0Da3fB83CB3a980Db215f47D456317cE` |

### Distribución Tokenomics (MetaMask — misma dirección Mainnet + Fuji)
| Cajón | % | OMMY | Dirección |
|-------|---|------|-----------|
| 🔥 Burn permanente | 25% | 7,494,811,450 | `0x000000000000000000000000000000000000dEaD` |
| 🌱 Ecosistema & Rewards | 25% | 7,494,811,450 | `0xF49FBE7764932c5Ca95f0Da80F54C3C65C6ec294` |
| 💧 Liquidez DEX | 15% | 4,496,886,870 | `0x9EE85AE6D167bb5737aB85407088E766237Ed38a` |
| 🔒 Pre-compra (lock→21 Dic 2026) | 10% | 2,997,924,580 | `0x7c7cd287e3901888d29218b4fDe00C9c6Bc0F1e2` |
| 👥 Equipo (4yr vesting) | 10% | 2,997,924,580 | `0xF8099E1cFc08FE7845188e5d77d70fedCd40802c` ✅ Safe 2/2 |
| 📣 Marketing | 7% | 2,098,547,206 | `0x1f1a22351F1CD24f5aaF70AA72F130Ec52Fa7c06` ✅ Safe 2/2 |
| 🏛️ DAO Treasury | 5% | 1,498,962,290 | `0x6d7d88dBC7266Cfd9F5BF6B2324372eA9Cb70867` ✅ Safe 2/2 |
| 🎁 Reserva Drops | 3% | 899,377,374 | `0x15137EF263D78353458B57Bcb60b210AF4c827Bc` |
| 🔥 Burn controlado (drops/eventos) | — | — | `0x109706Ff57E7f83a51A691C5BA8Beb4C190C6aac` |

> Safe multisig configurados en app.safe.global (Avalanche). Owners: 0x15Eb... (tú) + 0x490F... (padre). Threshold 2/2.

## Contratos On-Chain

| Contrato | Red | Dirección |
|----------|-----|-----------|
| Ommy Coin (ERC-20) | Avalanche Mainnet (43114) | `0x70EdA9Bb95eeE2551261c37720933905f9425596` |
| Om Domo NFT (ERC-1155) | Avalanche Fuji Testnet (43113) | `0xd51de87FbC012b694922036C30E5C82e16594958` |
| Om Domo NFT (ERC-1155) | Avalanche Mainnet (43114) | `0xf71abB919CFE72B0985f44f518A2432CA891AE27` |

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
SHOPIFY_WEBHOOK_SECRET_EU=            # HMAC secret webhook tienda EU omdomo.com (reemplaza SHOPIFY_WEBHOOK_SECRET)
SHOPIFY_WEBHOOK_SECRET_CL=            # HMAC secret webhook tienda CL omdomo.cl
SHOPIFY_WEBHOOK_SECRET=               # Legacy — fallback si SHOPIFY_WEBHOOK_SECRET_EU no está
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
| Shopify Webhook EU | ✅ Implementado | Pedido pagado → web3.omdomo.com/api/shopify/webhook?store=eu |
| Shopify Webhook CL | ⏳ Pendiente config | Pedido pagado → web3.omdomo.com/api/shopify/webhook?store=cl |
| GitHub | ✅ Conectado | github.com/omdomocom/omdomo-web3 (auto-deploy en push a main) |

## Multi-tienda Shopify

El webhook soporta dos tiendas con un único endpoint. La detección de tienda se hace por:
1. Query param `?store=eu` o `?store=cl` en la URL del webhook (recomendado, configurar en Shopify)
2. Header `X-Shopify-Shop-Domain` como fallback automático

**Prefijos de claim ID para evitar colisiones:**
- EU (`omdomo.com`): `${orderId}-${product_id}` — sin prefijo (backward compatible)
- CL (`omdomo.cl`): `cl_${orderId}-${product_id}` — prefijo `cl_`

**Conversión de moneda:**
- Los OMMY se calculan siempre en USD (70 OMMY/USD)
- EUR y CLP se convierten via CoinGecko API con cache de 1 hora
- Fallback hardcodeado: EUR=1.08 USD, CLP=0.00105 USD (~950 CLP/USD)

**Para activar omdomo.cl:**
1. Crear webhook en Shopify Chile Admin → Settings → Notifications → Webhooks
2. Event: Order payment | URL: `https://web3.omdomo.com/api/shopify/webhook?store=cl`
3. Copiar el secret generado → añadir como `SHOPIFY_WEBHOOK_SECRET_CL` en Vercel

## Comunidad

- Discord: https://discord.gg/xXezFXnpaX
- Instagram: instagram.com/om.domo
- TikTok: tiktok.com/@omdomo.com
- Twitter/X: twitter.com/omdomocom
- YouTube: youtube.com/@omdomocom

## Estructura de Archivos

```
next.config.ts                        # Security headers HTTP + remotePatterns next/image
public/
├── logo-negro.png                    # Logo Om Domo original (negro sobre blanco)
└── logo-blanco.png                   # Logo invertido para uso sobre fondos oscuros

nft-studio/                           # ← NUEVO: pipeline de generación de NFTs con IA
├── NFT_STUDIO_STRATEGY.md            # Estrategia completa: 13 colecciones, calendario, DAO economics
├── collections/
│   ├── index.ts                      # Registro maestro: tipos + ALL_COLLECTIONS + helpers
│   ├── chakras.ts                    # 7 NFTs, 1 temporada, Jul 2026  [tokenIds 20-26]
│   ├── yoga.ts                       # 21 NFTs, 3 temporadas, Ago 2026-Mar 2027 [27-47]
│   ├── reiki.ts                      # 28 NFTs, 4 temporadas, Sep 2026-Ago 2027 [48-75]
│   ├── lunar-phases.ts               # 8 NFTs, 1 temporada, Oct 2026 [76-83]
│   ├── elements.ts                   # 5 NFTs, 1 temporada, Nov 2026 [84-88]
│   ├── mudras.ts                     # 21 NFTs, 3 temporadas, Feb 2027-Feb 2028 [89-109]
│   ├── pranayama.ts                  # 14 NFTs, 2 temporadas, Jun 2027-Nov 2027 [110-123]
│   ├── kundalini.ts                  # 7 NFTs, 1 temporada, Abr 2027 [124-130]
│   ├── sacred-geometry.ts            # 9 NFTs, 2 temporadas, Jul 2027-Ene 2028 [131-139]
│   ├── mantras.ts                    # 9 NFTs, 2 temporadas, Oct 2027-Mar 2028 [140-148]
│   └── sacred-plants.ts              # 13 NFTs, 2 temporadas, Dic 2027-Abr 2028 [149-161]
│                                     # (guardians + zodiac pendientes: [162+])
├── generator/
│   └── replicate-client.ts           # Cliente Replicate: generateNFTVariants, generateSeasonBatch
├── seasons/
│   └── calendar.ts                   # Calendario 2026-2027: SEASON_CALENDAR, getSeasonPhase()
└── voting/
    └── feedback-filter.ts            # Claude Haiku: classifyFeedback → ACEPTADO/NEUTRAL/DESCARTADO

src/
├── app/
│   ├── page.tsx                      # Root: LandingPage pública
│   ├── layout.tsx                    # ThirdwebProvider + TooltipProvider + Playfair Display
│   ├── globals.css                   # Tailwind + shadcn tokens (purple/space) + dual dark/cream
│   ├── claim/page.tsx                # Página claim NFT (dynamic import)
│   ├── drops/page.tsx                # Página drops con countdown
│   ├── dashboard/page.tsx            # Dashboard Web3 completo
│   ├── nft/page.tsx                  # Colección NFT + rareza + Guardianes
│   └── api/
│       ├── agent/route.ts            # Multi-agent Claude API — rate limit 10 req/min/IP
│       ├── shopify/webhook/route.ts  # Webhook Shopify → claim + email (HMAC timingSafeEqual)
│       ├── nft/
│       │   ├── approve-claim/route.ts
│       │   ├── mint/route.ts         # DropClaimExceedLimit → 409. Error details solo en dev.
│       │   ├── confirm-claimed/route.ts
│       │   └── check-claim/route.ts
│       ├── share/route.ts            # Share-to-earn (+500 OMMY Twitter/IG)
│       ├── prices/route.ts           # Precios live CoinGecko (cache 60s + fallback mock)
│       └── burn/stats/route.ts       # Estadísticas de burn dinámicas
├── components/
│   ├── LandingPage.tsx               # Landing pública completa (12 secciones)
│   ├── Dashboard.tsx                 # Layout tabs: Overview|NFT|dApp|Finanzas|DAO|Social|Perfil|AI
│   ├── ProfilePanel.tsx              # Perfil usuario: avatar, bio, 12 temas de fondo
│   ├── CommunityPanel.tsx            # Feed público + mensajes privados 1:1
│   ├── ChatInterface.tsx             # Chat con Coordinator AI
│   ├── AgentsPanel.tsx               # Lista de 5 agentes especializados
│   ├── AgentCard.tsx                 # Card individual de agente
│   ├── WalletPanel.tsx               # Connect wallet + balance OMMY/AVAX + toggle Test/Real
│   ├── RoadmapPanel.tsx              # 5 fases — colapsable con puntos de progreso
│   ├── TokenomicsPanel.tsx           # Stats live tokenomics (sin proyección de precio)
│   ├── AnimatedBackground.tsx        # Fondos animados: Clouds/Ocean/Lava/Forest/Solid
│   ├── Web3AcademyPanel.tsx          # Academy: artículos Web3 + recompensa OMMY por lectura
│   ├── CryptoPanel.tsx               # Precios BTC/ETH/AVAX/XRP/OMMY + sparklines SVG
│   ├── NFTCollectionPanel.tsx        # Colección NFT con flip cards + rareza
│   ├── GamificationPanel.tsx         # Niveles XP + badges + misiones diarias
│   ├── PurchasesPanel.tsx            # Compras + funnel conversión
│   ├── DAOPanel.tsx                  # Sub-tabs: Propuestas | NFT Studio
│   ├── NFTStudioVoting.tsx           # ← NUEVO: DAO voting para NFT Studio (ver detalle abajo)
│   ├── InviteFriendPanel.tsx         # Referral link + tiers de recompensa
│   ├── SocialCarousel.tsx            # Carrusel infinito RRSS (Framer Motion)
│   ├── ClaimPageClient.tsx           # Flow 4 pasos: lookup→connect→mint→share
│   ├── ClaimZodiacClient.tsx         # Claim zodiacal — nuevo estado "already-claimed"
│   ├── SpaceBackground.tsx           # Canvas: estrellas interactivas + gravedad cursor
│   └── TestPurchasePanel.tsx         # Dev-only: simula compra Shopify
│   └── ui/                           # shadcn/ui: badge, button, card, progress,
│                                     #   scroll-area, separator, tabs, tooltip
├── lib/
│   ├── thirdweb.ts                   # Clientes Thirdweb + getOmmyContract()
│   ├── nft.ts                        # getNFTContract() + rarity system
│   ├── claims.ts                     # Redis (ioredis) + fallback in-memory + campo store
│   ├── tokenomics.ts                 # Fuente única de verdad tokenomics
│   ├── email.ts                      # Resend email — store-aware (EU/CL)
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
| `/dashboard` | Dashboard completo: Wallet + 8 tabs + Chat AI + Comunidad + Perfil |

## Dashboard — Tabs

| Tab | Contenido |
|-----|-----------|
| Overview | Stats globales + compras recientes + gamificación |
| Mi Colección | NFTs con flip cards + rareza + slots bloqueados |
| dApp | Herramientas: Claim, Drops, Staking, Tienda, Links rápidos |
| Finanzas | Precios live crypto + tokenomics OMMY |
| DAO | Sub-tab Propuestas (votación +200 OMMY) + Sub-tab NFT Studio |
| Comunidad | Feed público + mensajes privados 1:1 |
| Mi Perfil | Avatar, bio, 12 temas de fondo |
| AI Coordinator | Chat multi-agente Claude |

## Temas de Fondo Dashboard (10)

```
Animados:  Espacio 🌌 | Nubes ☁️ | Océano 🌊 | Lava 🌋 | Bosque 🌲
Sólidos:   Midnight 🌑 | Púrpura 🔮 | Esmeralda 💚 | Cobre 🟤
Claro:     Luz ☀️
```
- Guardados en `localStorage` junto al perfil del usuario
- Animados: CSS keyframes GPU-accelerated (cloud-drift, bubble-rise, lava-move, tree-sway)
- Modo claro (Luz) activa `data-mode="light"` en el root → overrides CSS en globals.css
- Toggle Luna/Sol en la barra superior del dashboard

## Design System

- **Tema dual**: secciones dark (`--dark-bg: #0c0906`) + cream (`--cream-bg: #f5f0e8`)
- **shadcn/ui**: tokens CSS mapeados a purple/space (`--primary: #7c3aed`, `--accent: #0891b2`)
- **Tipografía**: Playfair Display (serif) via `next/font` + system sans-serif
- **Clases clave**: `.section-dark`, `.section-cream`, `.glass`, `.glass-light`, `.gradient-text`, `.gradient-text-gold`, `.card-cream-hover`
- **Animación shimmer**: `.shimmer-omdomo` — sweep de luz sobre "Om Domo" en hero
- **SpaceBackground**: canvas con gravedad en cursor, drift orgánico, estrellas fugaces
- **tailwind.config.ts**: colores shadcn como CSS vars + `darkMode: "class"`

## Seguridad

### Medidas implementadas ✅
- **Shopify webhook**: HMAC-SHA256 verificado con `timingSafeEqual` (previene timing attacks)
- **Rate limiting** en `/api/agent`: 10 req/min por IP (Redis persistente + fallback memoria)
- **Rate limiting** en `/api/nft/claim-zodiac`: 5 req/10 min por IP
- **Rate limiting** en `/api/precompra/checkout`: 10 req/10 min por IP (previene spam Stripe sessions)
- **Rate limiting** en `/api/profile` POST: 5 req/10 min por IP (previene spam de perfiles)
- **Límite mensaje AI**: máx. 2000 caracteres (previene ataques de coste)
- **Wallet validation**: regex `^0x[a-fA-F0-9]{40}$` en todos los endpoints
- **Error leak**: `details` de error solo en `NODE_ENV=development`, nunca en producción
- **Security headers HTTP** via `next.config.ts`:
  - `X-Frame-Options: SAMEORIGIN` (anti-clickjacking)
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security` (HSTS 1 año + preload)
  - `Content-Security-Policy` (permite Thirdweb, Avalanche RPCs, CoinGecko)
  - `Permissions-Policy` (bloquea cámara, micrófono, geolocalización)
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Dependencias**: 0 vulnerabilidades (npm audit fix aplicado 2026-04-04)
- **Double-claim prevention**: Redis key `share:{wallet}:{orderId}:{platform}` previene re-claim
- **NFT mint wallet verification**: `/api/nft/mint` verifica que `walletAddress` coincide con la aprobada en `approve-claim` (previene robo de NFT con orderId ajeno)
- **NFT mint zodiac anti-double-claim**: `/api/nft/mint?type=zodiac` consulta Redis antes de mintear (segunda línea de defensa además de `/api/nft/claim-zodiac`)
- **confirm-claimed txHash validation**: regex `^0x[a-fA-F0-9]{64}$` + verificación wallet antes de marcar claim como completado
- **avaxPriceUSD server-side**: `/api/precompra/register` obtiene el precio de AVAX desde CoinGecko en el servidor — el cliente ya no puede manipular el precio para inflar OMMY reservados
- **txHash format validation**: `/api/precompra/register` valida formato `^0x[a-fA-F0-9]{64}$` antes de guardar en Redis
- **ommyAmount max cap en checkout**: `/api/precompra/checkout` limita a 50M OMMY por sesión ($50,000)
- **Redis singleton unificado**: `/api/profile` ahora usa `getRedis()` de `@/lib/redis` en lugar de su propio cliente duplicado

### Pendiente reforzar ⚠️
- `SHOPIFY_WEBHOOK_SECRET` debe estar configurado en Vercel (sin él el webhook acepta sin verificar)
- `/api/share` sin verificación de que el post existe realmente (honesty system por ahora)
- Rotar `THIRDWEB_SECRET_KEY` antes del lanzamiento mainnet
- `MINTER_PRIVATE_KEY` — asegurar que solo tiene AVAX suficiente para gas (wallet mínima)
- `/api/nft/approve-claim` sin auth — cualquiera puede pre-aprobar un claim si sabe el orderId (mitigado: mint verifica wallet; considerar añadir verificación por email en Fase 2)

## Claims — Redis Schema

```
claim:{id}              → JSON del Claim completo
order-index:{orderId}   → array de claim IDs por orden Shopify
email-index:{email}     → array de claim IDs por email
share:{wallet}:{orderId}:{platform} → ShareRecord (anti-double-claim)
shares:wallet:{wallet}  → array de share keys por wallet
```

Fallback: si `REDIS_URL` no está configurado → usa Map en memoria con warning en consola.

## Tokenomics Ommy Coin

| Parámetro | Valor |
|-----------|-------|
| Supply inicial | 29,979,245,800 OMMY |
| Supply final (objetivo) | 8,993,773,740 OMMY (70% burn en ~4 años) |
| Precio lanzamiento | $0.001 |
| Market Cap lanzamiento | ~$3M |
| FDV | ~$30M |
| Rate rewards | **70 OMMY por USD gastado** |

### Distribución Supply (CONFIRMADA)
| Segmento | % | OMMY aprox |
|----------|---|-----------|
| Ecosistema & Rewards | 25% | ~7.49M |
| Pre-compra (lock→21 Dic 2026) | 10% | ~3.00M |
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
Rate limit: 10 req/min/IP — mensaje máx. 2000 chars

| Agente | Especialidad |
|--------|-------------|
| Om Domo Coordinator | Dirige, prioriza, sintetiza |
| Web3 Architect | Avalanche, contratos, thirdweb, staking |
| Product Strategist | Ventas Shopify+Web3, NFTs, funnels |
| App Builder | App Proof of Conscious Activity |
| Community Architect | DAO, Discord/Telegram, ambassadors |
| Creative Director | NFT art, fashion, drops |

Flow: `POST /api/agent` → rate limit check → selectAgents() → callAgent() paralelo → coordinatorSynthesize()

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

## NFT Studio — Sistema de Generación IA

Pipeline completo para crear NFTs con Replicate AI + votación DAO.

### 13 Colecciones (2026–2028)

| Colección | NFTs | Seasons | Primer lanzamiento | TokenIds |
|-----------|------|---------|-------------------|----------|
| Chakras | 7 | 1 | Jul 2026 | 20-26 |
| Yoga Asanas | 21 | 3 | Ago 2026 | 27-47 |
| Reiki | 28 | 4 | Sep 2026 | 48-75 |
| Fases Lunares | 8 | 1 | Oct 2026 | 76-83 |
| Elementos | 5 | 1 | Nov 2026 | 84-88 |
| Mudras | 21 | 3 | Feb 2027 | 89-109 |
| Pranayama | 14 | 2 | Jun 2027 | 110-123 |
| Kundalini | 7 | 1 | Abr 2027 | 124-130 |
| Geometría Sagrada | 9 | 2 | Jul 2027 | 131-139 |
| Mantras & Frecuencias | 9 | 2 | Oct 2027 | 140-148 |
| Plantas Maestras | 13 | 2 | Dic 2027 | 149-161 |
| Guardianes | TBD | TBD | 2028 | 162+ |
| Zodíaco (Studio) | TBD | TBD | 2028 | TBD |

### Ciclo Mensual con Doble Feedback

```
Semana 1:   Generación IA (Replicate SDXL / Flux 1.1 Pro)
Semana 2a:  Primer feedback comunidad (Lun–Mié)
Jueves:     IA refina diseños con el feedback
Semana 2b:  Segundo feedback complementario (Jue–Dom) — comparativa original vs. refinado
Semana 3:   Votación final DAO (necesita NFT o 10,000 OMMY)
Semana 4:   Lanzamiento mint (5€ regular, 2.5€ DAO voters, gratis para compradores Shopify)
```

### Rewards NFT Studio
- Feedback válido: +100 OMMY por NFT por ronda (feedback1 + feedback2)
- Votación final: +200 OMMY por NFT
- Top 3 feedback más útil: +500 OMMY
- Colección completa: +5,000 OMMY bonus
- DAO voter mint: 50% descuento (5€ → 2.5€)

### Rareza por unidades
- `standard` = 111 unidades
- `rare` = 33 unidades
- `legendary` = 11 unidades (animados)

### NFTStudioVoting — Componente DAO

`src/components/NFTStudioVoting.tsx` — 3 tabs:
1. **NFTs**: grid de propuestas con feedback/voto según fase activa
2. **Stats**: ranking community score + distribución rareza + tabla OMMY rewards
3. **Calendario**: ciclo mensual visual + próximas temporadas

Fases detectadas automáticamente según fecha actual via `getSeasonPhase()` en `calendar.ts`.

## Implementado ✅

- Landing pública con 12 secciones (dark/cream dual theme, Framer Motion)
- Página `/nft` completa — rareza, 4 tipos NFT + Guardianes en ScrollCarousel
- Dashboard `/dashboard` con 8 tabs + sidebar colapsable (vue-element-admin style)
- **Sidebar colapsable**: 220px ↔ 64px, transición 0.28s, wallet arriba + nav abajo
- **10 temas de fondo**: 5 animados (CSS keyframes: nubes, océano, lava, bosque, espacio) + 4 sólidos + luz
- **Modo claro/oscuro** (Luna/Sol toggle): `data-mode="light|dark"` + overrides CSS `[data-mode="light"]`
- `AnimatedBackground.tsx`: `CloudsBackground`, `OceanBackground`, `LavaBackground`, `ForestBackground`, `SolidBackground`
- `ProfilePanel`: avatar emoji/foto, username, bio, 10 temas de fondo (guardado localStorage)
- `WalletPanel`: toggle Test(Fuji)/Real(Mainnet), logo OMMY (OM), logo AVAX oficial rojo, balance OMMY 8 dígitos + `...`
- `NotificationsDropdown`: `createPortal` a `document.body` — z-index correcto sobre todo el contenido
- `RoadmapPanel`: colapsable compacto con puntos de progreso y fechas
- `Web3AcademyPanel`: artículos Web3 con recompensa OMMY por lectura
- `CommunityPanel`: feed público con likes + mensajes privados 1:1 con chat
- `CryptoPanel`: BTC/ETH/AVAX/XRP/OMMY con sparklines SVG, refresh 60s
- `GamificationPanel`: 6 niveles XP, 8 badges, 5 misiones diarias
- `NFTCollectionPanel`: grid con flip cards 3D, rarity badges, locked slots
- `DAOPanel`: sub-tabs Propuestas + NFT Studio; 4 propuestas, votación, +200 OMMY reward
- `NFTStudioVoting`: panel DAO votación NFTs con doble feedback y comparativa
- `InviteFriendPanel`: referral link, límite 3 invitados, barra progreso, compartir Twitter/WhatsApp
- `SocialCarousel`: carrusel infinito 8 redes sociales (Framer Motion)
- DAppPanel: sección "Disponible ahora" + "Próximamente" con badges (yoga, actividad, meditación, arte)
- SobreNosotrosPanel: misión, visión, valores, roadmap resumen, links sociales
- TokenomicsPanel: eliminada proyección de precio (solo datos reales)
- shadcn/ui instalado: badge, button, card, progress, scroll-area, separator, tabs, tooltip
- `next.config.ts` con security headers completos (CSP, HSTS, X-Frame-Options, etc.)
- Shopify webhook HMAC con `timingSafeEqual` (anti timing-attack)
- **Multi-tienda Shopify EU + CL**: un endpoint, HMAC por tienda, prefijo claim ID, conversión CLP→USD
- Rate limiting `/api/agent`: 10 req/min/IP
- 0 vulnerabilidades npm (audit fix 2026-04-04)
- Redis Cloud (ioredis) — claims persistentes con fallback in-memory
- Supabase: campo `store` añadido a tabla `claims` (`ALTER TABLE claims ADD COLUMN store TEXT DEFAULT 'eu'`)
- Email automático via Resend al cliente tras cada compra (store-aware: EU/CL)
- Share-to-earn `/api/share` (+500 OMMY, anti double-claim)
- NFT rarity system (Genesis/Founder/Community/Standard)
- `src/lib/tokenomics.ts` — fuente única de verdad tokenomics
- TestPurchasePanel dev-only (NODE_ENV=development)
- GitHub → Vercel auto-deploy en push a main
- Discord: https://discord.gg/xXezFXnpaX
- **Fix `DropClaimExceedLimit`**: `/api/nft/mint` detecta el error y responde 409; `ClaimZodiacClient` muestra estado `already-claimed` en lugar de pantalla de error genérica

## Nuevas variables de entorno requeridas

```
STRIPE_SECRET_KEY=sk_live_...     # Stripe para pago pre-compra con tarjeta
```

## ⚠️ Acción inmediata requerida

```bash
# Ejecutar en tu terminal (el sandbox no puede hacer push):
cd ~/Desktop/web3
git push origin main
```
Esto despliega en Vercel: NFT Studio completo + fix DropClaimExceedLimit + NFTStudioVoting en DAO.

## Pendiente para Lanzamiento ⏳

### Crítico antes de Jun 2026
- [ ] `git push origin main` — subir los 2 commits pendientes (ver arriba)
- [ ] Configurar Thirdweb Dashboard: claim conditions para token IDs zodiacales (1-12)
  - `maxClaimablePerWallet` = 1 (ya está, es correcto)
  - Verificar que la wallet que tuvo `DropClaimExceedLimit` ya tiene el NFT on-chain
  - Si el NFT no llegó: resetear claim counter en Thirdweb para esa wallet
- [ ] Crear producto Drop #1 Genesis en Shopify (100 hoodies, €89)
- [ ] Probar flujo completo end-to-end con compra real
- [ ] Configurar `SHOPIFY_WEBHOOK_SECRET` en Vercel (actualmente sin verificar en prod)
- [ ] Configurar webhook Shopify Chile: `?store=cl` + `SHOPIFY_WEBHOOK_SECRET_CL` en Vercel

### Antes de mainnet
- [ ] Rotar `THIRDWEB_SECRET_KEY`
- [ ] `MINTER_PRIVATE_KEY` — verificar que solo tiene AVAX para gas

### Fase 2 (Sep 2026)
- [ ] Referral system on-chain
- [ ] Staking NFT 50 OMMY/día
- [ ] Rate limiting `/api/agent` con Redis persistente entre instancias
- [ ] Pre-compra: mecanismo de pago real (actualmente informacional)

### NFT Studio — Próximo
- [ ] Crear colecciones `guardians.ts` y `zodiac.ts` (studio, distinto al zodiacal actual) — tokenIds 162+
- [ ] Integrar Replicate API real para generación de imágenes
- [ ] Conectar `NFTStudioVoting` a datos reales (actualmente usa mock `MOCK_SEASON`)
- [ ] API routes para guardar/leer feedback de la comunidad en Redis/Supabase
- [ ] Activar `NFTStudioVoting` con datos reales al lanzar primera temporada (Jul 2026)

## Convenciones de Código

- **TypeScript strict** — no `any` sin justificación
- **Thirdweb v5** — siempre usar `prepareContractCall`, `sendTransaction`, `useReadContract`
- **SSR safety** — cualquier componente con Thirdweb: `"use client"` + `dynamic(..., {ssr: false})`
- **Tailwind dual theme** — usar variables CSS (`var(--dark-bg)`, `var(--cream-bg)`) + clases `.section-dark` / `.section-cream`
- **shadcn tokens** — `bg-background`, `text-foreground`, `bg-primary`, etc. apuntan al tema purple/space
- **Agentes en español** — todos los system prompts y respuestas en español
- **Claims async** — todas las funciones de claims son async (Redis)
- Burn amounts siempre usar `BigInt()` no literales `1n` (compatibilidad ES target)
- Resend: lazy init con `getResend()` — retorna null si no hay API key (no rompe build)
- Imágenes locales desde `/public/` usando `next/image` con `priority` en hero
- Error details en API routes: solo exponer en `NODE_ENV === "development"`
- Security headers: cualquier nueva ruta API hereda los headers de `next.config.ts`

## Mercado Objetivo

España 18-35 años, deportivo + wellness + crypto-curious.
Target: 200 (beta 2025) → 2,000 (2026) → 12,000 (2027) → 55,000 (2028)
Potencial real años 1-2: 26,000 personas España × 4 Europa = ~104,000
