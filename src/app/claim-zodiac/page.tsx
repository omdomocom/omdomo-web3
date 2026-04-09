"use client";

import dynamic from "next/dynamic";

const ClaimZodiacClient = dynamic(
  () => import("@/components/ClaimZodiacClient"),
  { ssr: false }
);

export default function ClaimZodiacPage() {
  return <ClaimZodiacClient />;
}
