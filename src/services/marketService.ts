import { MarketResponse, PairData } from '../types/MarketTypes';
import fetch from 'node-fetch';

export class MarketService {
    private readonly API_URL = '/api/markets';

    async fetchMarketData(): Promise<MarketResponse> {
        try {
            const response = await fetch(this.API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            throw new Error(`Error fetching market data: ${error}`);
        }
    }

    // Helper methods to extract specific data
    async getAllPairs(): Promise<PairData[]> {
        const data = await this.fetchMarketData();
        return data.pairs;
    }

    async getPairById(pairId: string): Promise<PairData | undefined> {
        const data = await this.fetchMarketData();
        return data.pairs.find(pair => pair.pairId === pairId);
    }

    // Get all unique creators
    async getAllCreators(): Promise<string[]> {
        const data = await this.fetchMarketData();
        return [...new Set(data.pairs.map(pair => pair.creator))];
    }

    // Get all pairs with price above certain threshold
    async getPairsAbovePrice(priceThreshold: string): Promise<PairData[]> {
        const data = await this.fetchMarketData();
        return data.pairs.filter(pair => 
            BigInt(pair.basePrice) > BigInt(priceThreshold)
        );
    }
}