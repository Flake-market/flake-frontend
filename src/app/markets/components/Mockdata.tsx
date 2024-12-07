import { Market } from "./MarketTable";

// Sample data - replace with actual data fetching
export const data: Market[] = [
    {
      contractAddress: "0xf1fdc83c3a336bdbdc9fb06e318b08eaddc82ff4",
      tokenName: "VITALIK",
      tokenTicker: "VTL/SOL",
      pairToken: "SOL", 
      marketCap: 1000000,
      price: 1.5,
      liquidity: 500000,
      volume: 50000,
      buys: 12,
      sells: 3,
      created: 1733576032
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
      created: 1733489632
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
      created: 1733403232
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
      created: 1733316832
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
      created: 1733144032
    }
  ]