import type { Metadata } from "next";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

export const metadata: Metadata = {
  title: "Om Domo | Ommy Coin Dashboard",
  description: "AI-powered coordinator for the Ommy Coin ecosystem on Avalanche",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  );
}
