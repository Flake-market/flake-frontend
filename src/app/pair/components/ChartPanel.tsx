"use client"
import { useEffect, useState } from "react"
import PriceChart from "./PriceChart"
import { SwapService } from "@/services/swapService"
import { Swap } from "../types/SwapTypes"

interface ChartPanelProps {
  pairAddress: string;
  onSwapsUpdate?: () => void;
}

export default function ChartPanel({ pairAddress, onSwapsUpdate }: ChartPanelProps) {
  const [swaps, setSwaps] = useState<Swap[]>([])
  const swapService = new SwapService()

  const fetchSwaps = async () => {
    try {
      const swapData = await swapService.getSwapsByPair(pairAddress)
      setSwaps(swapData)
    } catch (error) {
      console.error("Error fetching swaps:", error)
    }
  }

  useEffect(() => {
    fetchSwaps()
  }, [pairAddress])

  useEffect(() => {
    if (onSwapsUpdate) {
      fetchSwaps()
    }
  }, [onSwapsUpdate])

  return (
    <div className="h-full w-full relative">
      <PriceChart swaps={swaps} />
    </div>
  )
}

