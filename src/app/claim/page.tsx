"use client";

import dynamic from "next/dynamic";

const ClaimPageClient = dynamic(
  () => import("@/components/ClaimPageClient").then((m) => m.ClaimPageClient),
  { ssr: false }
);

export default function ClaimPage() {
  return <ClaimPageClient />;
}
