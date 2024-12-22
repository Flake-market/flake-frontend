import { NextResponse } from 'next/server'
import { Swap } from '@/app/pair/types/SwapTypes'

export async function GET() {
    try {
        const response = await fetch('https://backend-poc-885ae2550961.herokuapp.com/api/swaps')
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