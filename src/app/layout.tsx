import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { WalletProvider } from "@/contexts/WalletContext";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Flake",
  description: "Tokenize Attention on Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.className}`}>
      <body>
        <WalletProvider>
          <div className="w-full custom-background min-h-screen">
            <Navbar />
            <div className="h-[calc(100vh-66px)]">
              {children}
              <Toaster />
            </div>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
