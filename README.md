# Om Domo Web3

**Spiritual Web3 Lifestyle Ecosystem** — Lululemon + StepN + DAO espiritual + NFT art.

[![Vercel](https://img.shields.io/badge/Live-web3.omdomo.com-black?style=flat-square&logo=vercel)](https://web3.omdomo.com)
[![Avalanche](https://img.shields.io/badge/Blockchain-Avalanche-e84142?style=flat-square)](https://snowtrace.io/token/0x70EdA9Bb95eeE2551261c37720933905f9425596)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.9-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Thirdweb](https://img.shields.io/badge/Thirdweb-v5-7c3aed?style=flat-square)](https://thirdweb.com)
[![Lanzamiento](https://img.shields.io/badge/Launch-Junio%202026-gold?style=flat-square)](#roadmap)

---

## Qué es Om Domo Web3

Conectamos la tienda física de Om Domo ([omdomo.com](https://omdomo.com)) con el ecosistema Ommy Coin en Avalanche. Cada compra física recompensa al cliente con:

- **NFT** del diseño comprado (ERC-1155 Edition Drop)
- **OMMY Coins** — 70 OMMY por USD gastado
- **Acceso a la comunidad** gateada (Discord)

El dashboard incluye un **sistema multi-agente AI** (Claude API) con 5 especialistas: Web3 Architect, Product Strategist, App Builder, Community Architect y Creative Director — coordinados por Om Domo Coordinator.

---

## URLs

| | |
|--|--|
| Tienda | [omdomo.com](https://omdomo.com) (Shopify) |
| Web3 App | [web3.omdomo.com](https://web3.omdomo.com) (Vercel) |
| GitHub | [github.com/omdomocom/omdomo-web3](https://github.com/omdomocom/omdomo-web3) |
| Discord | [discord.gg/xXezFXnpaX](https://discord.gg/xXezFXnpaX) |

---

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15.3.9 (App Router) |
| Lenguaje | TypeScript strict |
| Blockchain | Avalanche (Mainnet 43114 / Fuji 43113) |
| Web3 SDK | Thirdweb v5 |
| AI | Anthropic Claude API (claude-opus-4-6) |
| Estilos | Tailwind CSS + shadcn/ui + Framer Motion |
| Emails | Resend (noreply@omdomo.com) |
| Persistencia | Redis Cloud (ioredis) |
| Deploy | Vercel (auto-deploy desde GitHub main) |

---

## Instalación

**Requisitos:** Node.js 18+, npm, cuentas en Thirdweb, Anthropic, Resend y Redis.

```bash
git clone https://github.com/omdomocom/omdomo-web3.git
cd omdomo-web3
npm install
cp .env.example .env.local   # editar con tus valores
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno (`.env.local`)

```env
# AI
ANTHROPIC_API_KEY=sk-ant-...

# Thirdweb
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=
THIRDWEB_SECRET_KEY=

# Contratos
NEXT_PUBLIC_OMMY_COIN_ADDRESS=0x70EdA9Bb95eeE2551261c37720933905f9425596
NEXT_PUBLIC_OWNER_WALLET=0x15Eb18b12979AD8a85041423df4C92de6EF186f9
NEXT_PUBLIC_NFT_CONTRACT_FUJI=0xd51de87FbC012b694922036C30E5C82e16594958
NEXT_PUBLIC_NFT_CONTRACT_MAINNET=          # pendiente migración mainnet

# Server
MINTER_PRIVATE_KEY=0x...                   # private key minter wallet
SHOPIFY_WEBHOOK_SECRET=                    # Shopify > Notificaciones > Webhooks
RESEND_API_KEY=re_...
EMAIL_FROM=Om Domo <noreply@omdomo.com>

# App
NEXT_PUBLIC_APP_URL=https://web3.omdomo.com
NEXT_PUBLIC_USE_MAINNET=false              # true = mainnet NFT
REDIS_URL=redis://...                      # Redis Cloud
```

> Sin `REDIS_URL`, los claims usan un `Map` en memoria (solo para desarrollo local).
> En `NODE_ENV=development` aparece el **TestPurchasePanel** para simular compras sin webhook real.

---

## Rutas

```
/                   Landing pública + Hero animado (12 secciones)
/nft                Colección NFT completa — rareza, 4 tipos, Guardianes (carrusel)
/claim              Claim NFT tras compra (buscar por Order ID o email)
/drops              Drops limitados con countdown a Junio 2026
/dashboard          Dashboard Web3 completo (8 tabs + sidebar colapsable)

POST /api/agent                  Chat multi-agente AI (rate limit 10 req/min/IP)
POST /api/shopify/webhook        Webhook orders/paid → crea claim + envía email
POST /api/nft/approve-claim      Valida claim + linkea wallet
POST /api/nft/mint               Mint server-side (minter wallet)
POST /api/nft/confirm-claimed    Registra txHash post-mint
GET  /api/nft/check-claim        Busca claim por orderId o email
POST /api/share                  Share-to-earn (+500 OMMY por red social)
GET  /api/prices                 Precios live CoinGecko (cache 60s + fallback)
GET  /api/burn/stats             Estadísticas de burn en tiempo real
```

---

## Flujo completo: Compra → NFT

```
1. Cliente compra en omdomo.com
2. Shopify dispara webhook → POST /api/shopify/webhook
3. Servidor crea claim en Redis + envía email al cliente
4. Cliente abre web3.omdomo.com/claim
5. Introduce su Order ID o email
6. Conecta wallet MetaMask (red: Avalanche)
7. Mint del NFT en su wallet
8. Comparte en Twitter/IG → +500 OMMY adicionales
```

---

## Contratos on-chain

| Contrato | Red | Dirección |
|----------|-----|-----------|
| Ommy Coin (ERC-20) | Avalanche Mainnet | `0x70EdA9Bb95eeE2551261c37720933905f9425596` |
| Om Domo NFT (ERC-1155) | Fuji Testnet | `0xd51de87FbC012b694922036C30E5C82e16594958` |
| Om Domo NFT (ERC-1155) | Avalanche Mainnet | ⏳ Pendiente migración |

- Symbol: **OMMY** | Decimals: 18
- NFT type: Edition Drop ERC-1155 v5.0.7

---

## Tokenomics

| Parámetro | Valor |
|-----------|-------|
| Supply inicial | 29,979,245,800 OMMY |
| Supply final objetivo | 2,997,924,580 OMMY (90% quemado en ~7-8 años) |
| Precio lanzamiento | $0.001 |
| Market Cap | ~$3M |
| FDV | ~$30M |
| Rewards rate | 70 OMMY por USD gastado |

**Distribución:** 25% Ecosistema & Rewards · 25% Quema programada · 15% Liquidez DEX · 10% Equipo (4yr vesting) · 7% Marketing · 5% DAO Treasury · 3% Drops

**Mecánica de Burn:** 500 OMMY por compra + 2% rewards · 5M OMMY por drop · 50 OMMY por share

---

## Dashboard — 8 Tabs

| Tab | Contenido |
|-----|-----------|
| Overview | Stats globales + compras recientes + gamificación |
| Mi Colección | NFTs con flip cards 3D + rarity badges |
| dApp | Herramientas live + sección "Próximamente" |
| Finanzas | Precios live crypto + tokenomics OMMY |
| DAO | Propuestas + votación + +200 OMMY |
| Comunidad | Feed público + mensajes privados 1:1 |
| Mi Perfil | Avatar, bio, 10 temas de fondo (5 animados + 4 sólidos + luz) |
| Academy | Artículos Web3 con recompensa OMMY por lectura |

### Temas de fondo (10)

| Tipo | Temas |
|------|-------|
| Animados | Espacio, Nubes, Océano, Lava, Bosque |
| Sólidos | Midnight, Púrpura, Esmeralda, Cobre |
| Claro | Luz |

---

## Sidebar colapsable

- **Expandido** (220px): wallet arriba, menú de navegación abajo
- **Colapsado** (64px): solo iconos + avatar
- Toggle con animación 0.28s · estado guardado en `localStorage`
- Modo oscuro/claro (Luna/Sol) en la barra superior

---

## Agentes AI

Sistema multi-agente en `src/lib/agents/definitions.ts`, modelo `claude-opus-4-6`.

| Agente | Especialidad |
|--------|-------------|
| Om Domo Coordinator | Dirige, prioriza y sintetiza |
| Web3 Architect | Avalanche, contratos, Thirdweb, staking |
| Product Strategist | Shopify, NFT drops, funnels, pricing |
| App Builder | App Proof of Conscious Activity (Fase 3) |
| Community Architect | DAO, Discord, ambassadors |
| Creative Director | NFT art, fashion, colecciones |

Flujo: `POST /api/agent` → rate limit → `selectAgents()` → llamadas en paralelo → `coordinatorSynthesize()`

---

## Roadmap

| Fase | Nombre | Fecha | Estado |
|------|--------|-------|--------|
| 1 | Motor de Ventas | Jun 2026 | **ACTIVA** |
| 2 | Economía Ommy Coin (staking, referrals) | Sep 2026 | Pendiente |
| 3 | App Proof of Conscious Activity | Ene 2027 | Pendiente |
| 4 | Comunidad DAO | Jun 2027 | Pendiente |
| 5 | Ommy Lab | 2028+ | Pendiente |

---

## Funcionalidades implementadas ✅

- Landing con 12 secciones (dark/cream dual theme, Framer Motion)
- Página `/nft` — rareza, 4 tipos NFT y Guardianes en carrusel
- Dashboard con **sidebar colapsable** (vue-element-admin style, 220px↔64px)
- **10 temas de fondo** — 5 animados (CSS keyframes GPU): nubes, océano, lava, bosque, espacio
- **Modo claro/oscuro** (Luna/Sol) con overrides `[data-mode="light"]` en CSS
- WalletPanel: logo OMMY + logo AVAX oficial · toggle Test(Fuji)/Real(Mainnet)
- OMMY balance: muestra primeros 8 dígitos + `...`
- Notificaciones con `createPortal` (z-index correcto sobre todo el contenido)
- RoadmapPanel colapsable con puntos de progreso
- Web3 Academy con recompensas OMMY por lectura
- GamificationPanel: 6 niveles XP, 8 badges, 5 misiones diarias
- DAOPanel: propuestas + votación + +200 OMMY
- InviteFriendPanel: referral link + límite 3 invitados + barra de progreso
- CommunityPanel: feed público + mensajes privados 1:1
- ProfilePanel: avatar emoji/foto + 10 temas de fondo
- CryptoPanel: BTC/ETH/AVAX/XRP/OMMY con sparklines SVG (refresh 60s)
- Shopify webhook → mint NFT → email automático (HMAC timingSafeEqual)
- Share-to-earn (+500 OMMY, anti double-claim con Redis)
- Redis Cloud — claims persistentes con fallback in-memory
- Multi-agente AI (claude-opus-4-6) con rate limit 10 req/min
- Security headers HTTP completos (CSP, HSTS, X-Frame-Options...)
- 0 vulnerabilidades npm · TypeScript strict sin errores

---

## Pendiente antes del lanzamiento ⏳

- [ ] Migrar NFT contract Fuji → Avalanche Mainnet
- [ ] `NEXT_PUBLIC_NFT_CONTRACT_MAINNET` + `NEXT_PUBLIC_USE_MAINNET=true`
- [ ] Crear Drop #1 Genesis en Shopify (100 hoodies, €89)
- [ ] Probar flujo completo end-to-end con compra real
- [ ] Configurar `SHOPIFY_WEBHOOK_SECRET` en Vercel
- [ ] Rotar `THIRDWEB_SECRET_KEY` antes de mainnet
- [ ] Pre-compra: mecanismo de pago real con Stripe

---

## Comunidad

- Discord: [discord.gg/xXezFXnpaX](https://discord.gg/xXezFXnpaX)
- Instagram: [@om.domo](https://instagram.com/om.domo)
- TikTok: [@omdomo.com](https://tiktok.com/@omdomo.com)
- Twitter: [@omdomocom](https://twitter.com/omdomocom)
- YouTube: [@omdomocom](https://youtube.com/@omdomocom)

---

> *"Consciencia, amor y creatividad — on-chain"*
> Om Domo · Spiritual Web3 Lifestyle Ecosystem · Lanzamiento Junio 2026
