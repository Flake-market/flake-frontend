"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams } from 'next/navigation'
import HeaderPanel from "../components/HeaderPanel"
import SummaryPanel from "../components/SummaryPanel"
import TransactionsPanel from "../components/TransactionsPanel"
import ActionPanel from "../components/ActionPanel"
import ChartPanel from "../components/ChartPanel"
// import { data } from "@/app/markets/components/Mockdata"
import { PairData } from "@/app/markets/types/MarketTypes"
import { MarketService } from "@/services/marketService"

export default function PairPage() {
  const [pairData, setPairData] = useState<PairData | null>(null)
  const params = useParams()
  const marketService = useMemo(() => new MarketService(), [])

  useEffect(() => {
    // Simulate API call with mock data
    const fetchPairData = async () => {
        const pair = await marketService.getPairByKey(params.address as string)
        setPairData(pair || null)
    }

    fetchPairData()
  }, [params.address, marketService])

  if (!pairData) return <div>Pair not found</div>

    return (
        <div className="grid grid-cols-[1fr,418.5px] h-full w-full border-b ">
        <div className="grid grid-rows-[68px,1fr,240px]">
            <section>
                <HeaderPanel 
                    contractAddress={pairData.pairKey}
                    tokenTicker={pairData.ticker}
                    price={pairData.price}
                    tokenImage={pairData.tokenImage}
                />
            </section>
            <section className="overflow-hidden border-y ">
                <ChartPanel />
            </section>
            <section>
                <TransactionsPanel pairKey={pairData.pairKey} />
            </section>
        </div>
        
        <div className="overflow-y-auto border-l">
            <section className="h-[250px] border-b">
                <SummaryPanel
                    tokenName={pairData.name}
                    description={pairData.description}
                    pairKey={pairData.pairKey}
                    socials={{
                        x: pairData.twitter,
                        telegram: pairData.telegram,
                        website: pairData.website
                    }}
                />
            </section>
            <section>
                <ActionPanel 
                    tokenTicker={pairData.ticker}
                    tokenImage={pairData.tokenImage}
                    pairAddress={pairData.pairKey}
                    attentionToken={pairData.attentionToken}
                    creatorPublicKey={pairData.creator}
                    basePrice={Number(pairData.basePrice)}
                />
            </section>
        </div>
        </div>
    )
}
