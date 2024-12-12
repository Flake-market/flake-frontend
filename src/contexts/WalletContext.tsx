'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WalletContextType {
  wallet: any | null;
  connected: boolean;
  connecting: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connected: false,
  connecting: false,
  publicKey: null,
  connect: async () => {},
  disconnect: async () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<any | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
      
      if (provider?.isPhantom) {
        setWallet(provider);
        
        // Handle account changes
        provider.on('accountChanged', (publicKey: any) => {
          if (publicKey) {
            setPublicKey(publicKey.toString());
          } else {
            // Disconnect
            setConnected(false);
            setPublicKey(null);
          }
        });
      }
    }
  }, []);

  const connect = async () => {
    try {
      setConnecting(true);
      
      if (!wallet) {
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const response = await wallet.connect();
      setPublicKey(response.publicKey.toString());
      setConnected(true);
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (wallet) {
        await wallet.disconnect();
        setConnected(false);
        setPublicKey(null);
      }
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error);
    }
  };

  return (
    <WalletContext.Provider 
      value={{
        wallet,
        connected,
        connecting,
        publicKey,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext); 