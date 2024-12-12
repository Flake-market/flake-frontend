interface PhantomProvider {
  isPhantom: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (publicKey: { toString: () => string } | null) => void) => void;
  off: (event: string, callback: (publicKey: { toString: () => string } | null) => void) => void;
}

interface Window {
  phantom?: {
    solana?: PhantomProvider;
  };
} 