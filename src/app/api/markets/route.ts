import { NextResponse } from 'next/server';
import { MarketResponse } from '@/app/markets/types/MarketTypes';

export async function GET() {
    try {
        const response = await fetch('http://localhost:3003/api/markets');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: MarketResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json(
            { error: 'Failed to fetch market data' },
            { status: 500 }
        );
    }
}