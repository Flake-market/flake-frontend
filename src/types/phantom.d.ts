interface PhantomProvider {
  isPhantom: boolean;
  publicKey: { toString: () => string };
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  on: (event: string, callback: (publicKey: { toString: () => string } | null) => void) => void;
  off: (event: string, callback: (publicKey: { toString: () => string } | null) => void) => void;
}

interface Window {
  phantom?: {
    solana?: PhantomProvider;
  };
} 