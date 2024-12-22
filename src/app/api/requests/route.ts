import { NextResponse } from 'next/server';
import { RequestResponse } from '@/app/pair/types/RequestTypes';

export async function GET() {
    try {
        const response = await fetch('https://backend-poc-885ae2550961.herokuapp.com/api/requests');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: RequestResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json(
            { error: 'Failed to fetch request data' },
            { status: 500 }
        );
    }
} 