import type { Metadata } from "next";
import { Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Om Domo | Spiritual Web3 Lifestyle",
  description: "Compra. Gana NFTs y OMMY Coin. Forma parte de la comunidad Web3 más consciente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={cn("dark font-sans", geist.variable, playfair.variable)}>
      <body>
        <ThirdwebProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
