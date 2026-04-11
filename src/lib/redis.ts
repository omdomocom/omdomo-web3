// ─── Redis singleton centralizado ────────────────────────────────────────────
// Único punto de acceso al cliente Redis (ioredis) en el servidor.
// Importar getRedis() en lugar de instanciar directamente.

let _redis: import("ioredis").Redis | null = null;

export async function getRedis(): Promise<import("ioredis").Redis | null> {
  const url = process.env.REDIS_URL || process.env.KV_REDIS_URL;
  if (!url) return null;

  if (!_redis) {
    const { default: Redis } = await import("ioredis");
    _redis = new Redis(url, { lazyConnect: false, maxRetriesPerRequest: 3 });
  }
  return _redis;
}
