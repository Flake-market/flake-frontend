'use client'

import { useWallet } from '@/contexts/WalletContext';
import { ReactNode } from 'react';

export function RequireWallet({ children }: { children: ReactNode }) {
  const { connected, connect } = useWallet();

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl mb-4">Connect Wallet to Continue</h1>
        <button
          onClick={connect}
          className="border-2 border-black rounded-sm bg-black text-white px-4 py-1.5 transition-all duration-200 hover:bg-black/80"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return <>{children}</>;
} 