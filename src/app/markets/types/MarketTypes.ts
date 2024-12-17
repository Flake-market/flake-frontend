export interface PriceRequest {
    price: string;
    description: string;
}

export interface PairData {
    pairId: string;
    pairKey: string;
    creator: string;
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
}

export interface MarketResponse {
    pairs: PairData[];
    totalPages: number;
    currentPage: number;
}