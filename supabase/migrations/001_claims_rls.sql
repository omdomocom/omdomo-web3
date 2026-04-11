-- ─── Tabla claims ────────────────────────────────────────────────────────────
-- Equivalente al tipo Claim de src/lib/claims.ts

CREATE TABLE IF NOT EXISTS claims (
  id               TEXT PRIMARY KEY,
  email            TEXT NOT NULL,
  product_title    TEXT NOT NULL DEFAULT '',
  product_image    TEXT NOT NULL DEFAULT '',
  order_total      NUMERIC(12,2) NOT NULL DEFAULT 0,
  ommy_reward      INTEGER NOT NULL DEFAULT 0,
  wallet_address   TEXT,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'claimed', 'failed')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed_at       TIMESTAMPTZ,
  tx_hash          TEXT,
  token_id         TEXT,
  shopify_order_id TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_claims_shopify_order_id ON claims(shopify_order_id);
CREATE INDEX IF NOT EXISTS idx_claims_email ON claims(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_claims_wallet ON claims(LOWER(wallet_address)) WHERE wallet_address IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

-- RLS: activar seguridad a nivel de fila
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Toda escritura (INSERT/UPDATE) solo desde service_role (API routes server-side)
-- El service_role bypasea RLS automáticamente — no necesita política explícita
-- La anon key NO puede escribir ni leer directamente

-- Lectura pública bloqueada por defecto (sin política = deny all desde anon)
-- Las API routes usan service_role_key para leer/escribir

-- ─── Tabla shares ─────────────────────────────────────────────────────────────
-- Equivalente al ShareRecord de src/app/api/share/route.ts

CREATE TABLE IF NOT EXISTS shares (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address   TEXT NOT NULL,
  platform         TEXT NOT NULL CHECK (platform IN ('twitter', 'instagram')),
  order_id         TEXT NOT NULL,
  post_url         TEXT,
  ommy_reward      INTEGER NOT NULL DEFAULT 0,
  ommy_burned      INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(wallet_address, order_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_shares_wallet ON shares(LOWER(wallet_address));
CREATE INDEX IF NOT EXISTS idx_shares_order_id ON shares(order_id);

ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Todas las operaciones solo vía service_role (API routes)
-- La UNIQUE constraint reemplaza la verificación manual de doble claim
