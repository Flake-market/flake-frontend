import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "atn.fun",
  description: "Tokenize Attention on Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
      <div className="w-full custom-background min-h-screen">
          <Navbar />
          <div className="p-2 mx-4 h-[calc(100vh-66px)]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
