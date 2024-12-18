export interface PriceRequest {
    price: string;
    description: string;
}

export interface PairData {
    pairId: string;
    pairKey: string;
    creator: string;
    attentionToken: string;
    basePrice: string;
    createdAt: string;
    name: string;
    ticker: string;
    description: string;
    tokenImage: string;
    twitter: string;
    telegram: string;
    website: string;
    requests: PriceRequest[];
    price: number;
    buys: number;
    sells: number;
    liquidity: number;
    marketCap: number;
    volume: number;
}

export interface MarketResponse {
    pairs: PairData[];
    totalPages: number;
    currentPage: number;
}