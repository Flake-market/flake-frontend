import { Market } from "./MarketTable";

// Sample data - replace with actual data fetching
export const data: Market[] = [
    {
      contractAddress: "0xf1fdc83c3a336bdbdc9fb06e318b08eaddc82ff4",
      tokenName: "VITALIK",
      tokenTicker: "VTL",
      pairToken: "SOL", 
      marketCap: 1000000,
      price: 1.5,
      liquidity: 500000,
      volume: 50000,
      buys: 12,
      sells: 3,
      created: 1733576032,
      logoUrl: "/images/tokens/pepe.svg"
    },
    {
      contractAddress: "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
      tokenName: "WEI DAI",
      tokenTicker: "WEI/SOL",
      pairToken: "SOL",
      marketCap: 750000,
      price: 0.75,
      liquidity: 250000,
      volume: 35000,
      buys: 8,
      sells: 5,
      created: 1733489632,
      logoUrl: "/images/tokens/pepe.svg"
    },
    {
      contractAddress: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0",
      tokenName: "CZ",
      tokenTicker: "CZ/SOL",
      pairToken: "SOL",
      marketCap: 2000000,
      price: 2.25,
      liquidity: 800000,
      volume: 120000,
      buys: 25,
      sells: 8,
      created: 1733403232,
      logoUrl: "/images/tokens/pepe.svg"
    },
    {
      contractAddress: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
      tokenName: "SZABO",
      tokenTicker: "SZABO/SOL",
      pairToken: "SOL",
      marketCap: 500000,
      price: 0.5,
      liquidity: 150000,
      volume: 25000,
      buys: 5,
      sells: 15,
      created: 1733316832,
      logoUrl: "/images/tokens/pepe.svg"
    },
    {
      contractAddress: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
      tokenName: "GAVIN",
      tokenTicker: "YORK/SOL",
      pairToken: "SOL",
      marketCap: 900000,
      price: 1.2,
      liquidity: 400000,
      volume: 45000,
      buys: 15,
      sells: 4,
      created: 1733144032,
      logoUrl: "/images/tokens/pepe.svg"
    }
  ]

export interface Transaction {
  date: string
  type: string
  priceSol: number
  priceUsd: number
  totalUsd: number
  amount: number
  totalSol: number
  txnHash: string
  contractAddress: string
}

export const transactionData: Transaction[] = [
  // VITALIK Transactions (0xf1fdc83c3a336bdbdc9fb06e318b08eaddc82ff4)
  {
    contractAddress: "0xf1fdc83c3a336bdbdc9fb06e318b08eaddc82ff4",
    date: "2024-03-20 14:30",
    type: "Buy",
    priceSol: 1.5,
    priceUsd: 150.00,
    totalUsd: 300.00,
    amount: 2,
    totalSol: 3.0,
    txnHash: "0xf1fd83c3a336bdbdc9fb06e318b08eaddc82ff4a1"
  },
  {
    contractAddress: "0xf1fdc83c3a336bdbdc9fb06e318b08eaddc82ff4",
    date: "2024-03-20 12:15",
    type: "Sell",
    priceSol: 1.48,
    priceUsd: 148.00,
    totalUsd: 148.00,
    amount: 1,
    totalSol: 1.48,
    txnHash: "0xf1fd83c3a336bdbdc9fb06e318b08eaddc82ff4b2"
  },

  // WEI DAI Transactions (0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1)
  {
    contractAddress: "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    date: "2024-03-20 11:30",
    type: "Buy",
    priceSol: 0.75,
    priceUsd: 75.00,
    totalUsd: 150.00,
    amount: 2,
    totalSol: 1.5,
    txnHash: "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1c3"
  },
  {
    contractAddress: "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    date: "2024-03-19 15:45",
    type: "Buy",
    priceSol: 0.73,
    priceUsd: 73.00,
    totalUsd: 219.00,
    amount: 3,
    totalSol: 2.19,
    txnHash: "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1d4"
  },

  // CZ Transactions (0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0)
  {
    contractAddress: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0",
    date: "2024-03-20 10:00",
    type: "Buy",
    priceSol: 2.25,
    priceUsd: 225.00,
    totalUsd: 1125.00,
    amount: 5,
    totalSol: 11.25,
    txnHash: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0e5"
  },
  {
    contractAddress: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0",
    date: "2024-03-19 16:20",
    type: "Sell",
    priceSol: 2.20,
    priceUsd: 220.00,
    totalUsd: 440.00,
    amount: 2,
    totalSol: 4.4,
    txnHash: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0f6"
  },

  // SZABO Transactions (0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0)
  {
    contractAddress: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
    date: "2024-03-20 09:15",
    type: "Sell",
    priceSol: 0.5,
    priceUsd: 50.00,
    totalUsd: 250.00,
    amount: 5,
    totalSol: 2.5,
    txnHash: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0g7"
  },
  {
    contractAddress: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
    date: "2024-03-19 14:30",
    type: "Buy",
    priceSol: 0.48,
    priceUsd: 48.00,
    totalUsd: 144.00,
    amount: 3,
    totalSol: 1.44,
    txnHash: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0h8"
  },

  // GAVIN Transactions (0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4)
  {
    contractAddress: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
    date: "2024-03-20 08:45",
    type: "Buy",
    priceSol: 1.2,
    priceUsd: 120.00,
    totalUsd: 480.00,
    amount: 4,
    totalSol: 4.8,
    txnHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4i9"
  },
  {
    contractAddress: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
    date: "2024-03-19 13:00",
    type: "Buy",
    priceSol: 1.18,
    priceUsd: 118.00,
    totalUsd: 236.00,
    amount: 2,
    totalSol: 2.36,
    txnHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4j0"
  }
]