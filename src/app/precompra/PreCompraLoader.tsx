"use client";

import dynamic from "next/dynamic";

const PreCompraClient = dynamic(() => import("@/components/PreCompraClient"), { ssr: false });

export default function PreCompraLoader() {
  return <PreCompraClient />;
}
