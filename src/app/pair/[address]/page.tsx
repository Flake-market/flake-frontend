"use client"

import { useEffect, useState } from "react"
import { useParams } from 'next/navigation'
import HeaderPanel from "../components/HeaderPanel"
import SummaryPanel from "../components/SummaryPanel"
import TransactionsPanel from "../components/TransactionsPanel"
import ActionPanel from "../components/ActionPanel"
import ChartPanel from "../components/ChartPanel"
import { data } from "@/app/markets/components/Mockdata"
import { Market } from "@/app/markets/components/MarketTable"

export default function PairPage() {
  const [pairData, setPairData] = useState<Market | null>(null)
  const params = useParams()

  useEffect(() => {
    // Simulate API call with mock data
    const fetchPairData = () => {
      const pair = data.find(item => item.contractAddress === params.address)
      setPairData(pair || null)
    }

    fetchPairData()
  }, [params.address])

  if (!pairData) return <div>Pair not found</div>

    return (
        <div className="grid grid-cols-[1fr,418.5px] h-full w-full border-b ">
        <div className="grid grid-rows-[68px,1fr,240px]">
            <section>
                <HeaderPanel 
                    contractAddress={pairData.contractAddress}
                    tokenTicker={pairData.tokenTicker}
                    pairToken={pairData.pairToken}
                    price={pairData.price}
                    logoUrl={pairData.logoUrl}
                />
            </section>
            <section className="overflow-hidden border-y ">
                <ChartPanel />
            </section>
            <section>
                <TransactionsPanel contractAddress={pairData.contractAddress} />
            </section>
        </div>
        
        <div className="overflow-y-auto border-l">
            <section className="h-[250px] border-b">
                <SummaryPanel />
            </section>
            <section>
                <ActionPanel />
            </section>
        </div>
        </div>
    )
}
