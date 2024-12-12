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
          className="hover:text-lime-400 rounded-sm bg-lime-500 hover:bg-primary/20 px-4 py-1.5 transition-all duration-200"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return <>{children}</>;
} 