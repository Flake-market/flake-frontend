"use client"

import HeaderPanel from "../components/HeaderPanel"
import SummaryPanel from "../components/SummaryPanel"
import TransactionsPanel from "../components/TransactionsPanel"
import ActionPanel from "../components/ActionPanel"
import ChartPanel from "../components/ChartPanel"

interface PageProps {
  params: {
    address: string
  }
}

export default function PairPage({ params }: PageProps) {
  return (
    <div className="grid grid-cols-[1fr,418.5px] h-full w-full border-b ">
      <div className="grid grid-rows-[68px,1fr,240px]">
        <section>
          <HeaderPanel />
        </section>
        <section className="overflow-hidden border-y ">
          <ChartPanel />
        </section>
        <section>
          <TransactionsPanel />
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
