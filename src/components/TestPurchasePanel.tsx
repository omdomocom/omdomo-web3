"use client";

import { useState } from "react";
import { ShoppingBag, Loader2, CheckCircle, ExternalLink } from "lucide-react";

const TEST_PRODUCTS = [
  { title: "Om Domo Genesis Hoodie", price: "79.99" },
  { title: "Om Domo Yoga Mat", price: "49.99" },
  { title: "Om Domo Cap", price: "29.99" },
];

export function TestPurchasePanel() {
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState(TEST_PRODUCTS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    orderId: string;
    ommyReward: number;
  } | null>(null);
  const [error, setError] = useState("");

  async function simulatePurchase() {
    if (!email) return;
    setLoading(true);
    setError("");
    setResult(null);

    const orderId = Math.floor(Math.random() * 900000) + 100000;

    try {
      const res = await fetch("/api/shopify/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          email,
          total_price: product.price,
          currency: "USD",
          line_items: [
            { title: product.title, product_id: orderId, quantity: 1 },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setResult({
        orderId: `${orderId}-${orderId}`,
        ommyReward: data.totalOmmyReward,
      });
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  }

  return (
    <div className="glass rounded-xl p-4 border border-yellow-500/20">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <p className="text-xs text-yellow-400 uppercase tracking-wider font-medium">
          Test Purchase (Dev)
        </p>
      </div>

      {!result ? (
        <div className="space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            type="email"
            className="w-full glass rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-yellow-500/40 focus:outline-none"
          />

          <select
            value={product.title}
            onChange={(e) =>
              setProduct(
                TEST_PRODUCTS.find((p) => p.title === e.target.value) ||
                  TEST_PRODUCTS[0]
              )
            }
            className="w-full glass rounded-lg px-3 py-2 text-xs text-slate-300 border border-slate-700/40 focus:outline-none bg-slate-900"
          >
            {TEST_PRODUCTS.map((p) => (
              <option key={p.title} value={p.title}>
                {p.title} (${p.price})
              </option>
            ))}
          </select>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={simulatePurchase}
            disabled={loading || !email}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-medium hover:bg-yellow-500/20 disabled:opacity-40 transition-all"
          >
            <span className="flex items-center justify-center">
              {loading
                ? <Loader2 size={12} className="animate-spin" />
                : <ShoppingBag size={12} />}
            </span>
            Simular compra en Shopify
          </button>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">
              Compra simulada
            </span>
          </div>
          <div className="text-xs space-y-1.5 glass rounded-lg p-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Order ID</span>
              <span className="font-mono text-slate-300">{result.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">OMMY reward</span>
              <span className="text-purple-300 font-bold">
                +{result.ommyReward} OMMY
              </span>
            </div>
          </div>
          <a
            href={`/claim?email=${encodeURIComponent(email)}`}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-600/30 transition-all"
          >
            <ExternalLink size={11} />
            Ir a /claim para mintear el NFT
          </a>
          <button
            onClick={() => { setResult(null); setEmail(""); }}
            className="w-full text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            Nueva prueba
          </button>
        </div>
      )}
    </div>
  );
}
