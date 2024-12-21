import { Swap } from '../app/pair/types/SwapTypes';

export class SwapService {
    private readonly API_URL = '/api/swaps';

    async getSwapsByPair(pairKey: string): Promise<Swap[]> {
        try {
            const response = await fetch(this.API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response data:', data); // Debug the raw response

            // Check if data is an array, if not, try to access the correct property
            const allSwaps: Swap[] = Array.isArray(data) ? data : (data.swaps || []);
            
            if (!Array.isArray(allSwaps)) {
                throw new Error('Invalid response format: expected an array of swaps');
            }

            return allSwaps.filter(swap => swap.pairKey === pairKey);
            
        } catch (error) {
            console.error('Original error:', error);
            throw new Error(`Error fetching swap data: ${error}`);
        }
    }
} 