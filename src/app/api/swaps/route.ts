import { NextRequest, NextResponse } from 'next/server'
import { Swap } from '@/app/pair/types/SwapTypes'

export async function GET(request: NextRequest) {
    try {
        const response = await fetch('http://localhost:3003/api/swaps')
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const swaps: Swap[] = await response.json()
        
        return NextResponse.json(swaps)
    } catch (error) {
        console.error('Error in API route:', error)
        return NextResponse.json(
            { error: 'Failed to fetch swap data' },
            { status: 500 }
        )
    }
} 