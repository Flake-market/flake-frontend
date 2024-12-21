import { Request } from '../app/pair/types/RequestTypes';

export class RequestService {
    private readonly API_URL = '/api/requests';

    async getRequestsByPairAndUser(pairKey: string, userId: string): Promise<Request[]> {
        try {
            const response = await fetch(this.API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const allRequests: Request[] = Array.isArray(data) ? data : (data.requests || []);
            
            return allRequests.filter(request => 
                request.pairKey === pairKey && 
                request.user === userId
            );
            
        } catch (error) {
            console.error('Original error:', error);
            throw new Error(`Error fetching request data: ${error}`);
        }
    }
} 