================================================================================
  OM DOMO WEB3 — Spiritual Web3 Lifestyle Ecosystem
  Ommy Coin · Avalanche · omdomo.com · Lanzamiento Junio 2026
================================================================================

DESCRIPCION
-----------
Plataforma Web3 que conecta la tienda Shopify de Om Domo (omdomo.com) con el
ecosistema Ommy Coin en Avalanche. Cada compra física recompensa al cliente con:
  - NFT del diseño comprado (ERC-1155 Edition Drop)
  - OMMY Coins (70 OMMY por USD gastado)
  - Acceso a la comunidad gateada (Discord/Telegram)

Sistema de agentes AI (Claude API) para coordinar el desarrollo del ecosistema:
  Web3 Architect · Product Strategist · App Builder · Community Architect · Creative Director


REQUISITOS
----------
  - Node.js 18+
  - npm / pnpm
  - Cuenta Thirdweb (thirdweb.com)
  - API key de Anthropic (Claude)
  - Cuenta Resend para emails (resend.com)


INSTALACION
-----------
  npm install


CONFIGURACION (.env.local)
--------------------------
Crea el archivo .env.local en la raíz del proyecto:

  ANTHROPIC_API_KEY=sk-ant-...
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID=...
  THIRDWEB_SECRET_KEY=...
  NEXT_PUBLIC_OMMY_COIN_ADDRESS=0x70EdA9Bb95eeE2551261c37720933905f9425596
  NEXT_PUBLIC_OWNER_WALLET=0x15Eb18b12979AD8a85041423df4C92de6EF186f9
  NEXT_PUBLIC_NFT_CONTRACT_FUJI=0xd51de87FbC012b694922036C30E5C82e16594958
  NEXT_PUBLIC_NFT_CONTRACT_MAINNET=         (dejar vacío hasta migrar)
  MINTER_PRIVATE_KEY=0x...                  (private key del deployer wallet)
  SHOPIFY_WEBHOOK_SECRET=                   (de Shopify Partners > Webhooks)
  RESEND_API_KEY=re_...
  EMAIL_FROM=Om Domo <noreply@omdomo.com>
  NEXT_PUBLIC_USE_MAINNET=false             (false = Fuji testnet, true = mainnet)
  KV_REST_API_URL=                          (Upstash — pendiente para producción)
  KV_REST_API_TOKEN=                        (Upstash — pendiente para producción)


DESARROLLO LOCAL
----------------
  npm run dev

  Abre http://localhost:3000

  En modo desarrollo (NODE_ENV=development) aparece el panel "Dev Tools" en el
  dashboard con accesos directos y el TestPurchasePanel para simular compras
  Shopify sin necesidad de webhook real.


RUTAS DISPONIBLES
-----------------
  /                   Dashboard principal con chat AI (Coordinator + 5 agentes)
  /claim              Página de claim NFT para clientes (buscar por order ID o email)
  /drops              Página de drops limitados con countdown a Junio 2026

  API:
  POST /api/agent               Chat con el sistema de agentes AI
  POST /api/shopify/webhook     Webhook de Shopify (evento: orders/paid)
  POST /api/nft/approve-claim   Validar claim + linkear wallet
  POST /api/nft/mint            Mint server-side (dev fallback)
  POST /api/nft/confirm-claimed Confirmar txHash después de mint client-side
  GET  /api/nft/check-claim     Buscar claim por orderId o email
  POST /api/share               Registrar share social (+500 OMMY)
  GET  /api/burn/stats          Estadísticas de burn en tiempo real


FLUJO COMPLETO: COMPRA → NFT
-----------------------------
  1. Cliente compra en omdomo.com (Shopify)
  2. Shopify dispara webhook POST /api/shopify/webhook
  3. El servidor crea un "claim record" y envía email al cliente
  4. Cliente va a omdomo.com/claim
  5. Introduce su order ID o email para encontrar su claim
  6. Conecta MetaMask (red: Avalanche)
  7. Firma la transacción → mint del NFT en su wallet
  8. Puede compartir en Twitter/IG para ganar +500 OMMY adicionales


CONTRATOS
---------
  Ommy Coin (ERC-20):
    Avalanche Mainnet (43114): 0x70EdA9Bb95eeE2551261c37720933905f9425596
    Symbol: OMMY | Decimals: 18

  Om Domo NFT (ERC-1155 Edition Drop):
    Avalanche Fuji Testnet (43113): 0xd51de87FbC012b694922036C30E5C82e16594958
    Avalanche Mainnet (43114): [PENDIENTE — migrar antes de Junio 2026]


AGENTES AI
----------
  Sistema multi-agente usando Claude API (claude-opus-4-6).
  Definiciones en: src/lib/agents/definitions.ts

  - Om Domo Coordinator: dirige, prioriza y sintetiza las respuestas del equipo
  - Web3 Architect:      Avalanche, contratos, thirdweb, staking, burn
  - Product Strategist:  ventas, Shopify, NFT drops, funnels, pricing
  - App Builder:         app Proof of Conscious Activity (Fase 3)
  - Community Architect: DAO, Discord, Telegram, ambassadors
  - Creative Director:   NFT art, fashion, colecciones, drops


TOKENOMICS CLAVE
----------------
  Supply inicial:  29,979,245,800 OMMY
  Supply final:     2,997,924,580 OMMY (90% quemado en ~7-8 años)
  Precio launch:   $0.001
  Market Cap:      ~$3M
  Rewards rate:    70 OMMY por USD gastado

  Burn por compra: 500 OMMY + 2% de rewards
  Burn por drop:   5,000,000 OMMY
  Burn por share:  50 OMMY


ROADMAP
-------
  Fase 1 (Jun 2026):  Motor de Ventas — NFT + OMMY + share-to-earn + drops  ← ACTUAL
  Fase 2 (Sep 2026):  Economía Ommy Coin — staking, burn automático, referrals
  Fase 3 (Ene 2027):  App Proof of Conscious Activity — meditación/yoga/running
  Fase 4 (Jun 2027):  Comunidad DAO — governance, foro, ambassadors
  Fase 5 (2028+):     Ommy Lab — NFT art + fashion + creator collabs


PENDIENTE ANTES DEL LANZAMIENTO
--------------------------------
  [ ] Migrar NFT contract de Fuji → Avalanche Mainnet
  [ ] Configurar NEXT_PUBLIC_NFT_CONTRACT_MAINNET y NEXT_PUBLIC_USE_MAINNET=true
  [ ] Configurar SHOPIFY_WEBHOOK_SECRET en Shopify Partners
  [ ] Deploy a producción (Vercel) — URL pública para el webhook Shopify
  [ ] Crear producto Drop #1 Genesis en Shopify (100 hoodies, €89)
  [ ] Upstash KV para claims persistentes (reemplazar in-memory Map)


PRODUCCION (Vercel)
-------------------
  1. Conecta el repo a Vercel
  2. Configura todas las variables de entorno en Vercel Dashboard
  3. Copia la URL de producción (ej: https://web3.omdomo.com)
  4. En Shopify Partners > Webhooks > Crear webhook:
       URL: https://tu-dominio.vercel.app/api/shopify/webhook
       Evento: orders/paid
       Versión API: 2024-01
  5. Guarda el Signing Secret en SHOPIFY_WEBHOOK_SECRET


STACK TECNICO
-------------
  Next.js 16 (App Router, Turbopack)
  TypeScript
  Thirdweb v5 SDK
  Anthropic Claude API
  Tailwind CSS
  Resend (emails)
  Avalanche (blockchain)


================================================================================
  Om Domo · Spiritual Web3 Lifestyle Ecosystem
  "Consciencia, amor y creatividad — on-chain"
================================================================================
