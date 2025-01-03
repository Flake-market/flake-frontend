"use client"
import Image from 'next/image';
import { Separator } from "@/components/ui/separator"
import { Copy } from "lucide-react"
import { formatLamports, solPrice } from "@/lib/utils";

interface HeaderPanelProps {
  contractAddress: string;
  tokenTicker: string;
  price: number;
  tokenImage: string;
}

export default function HeaderPanel({ contractAddress, tokenTicker, price, tokenImage }: HeaderPanelProps) {
  return (
    <div className="flex items-center h-full mx-2 px-4 space-x-4">
      <Image src={tokenImage} alt={`${tokenTicker} logo`} width={32} height={32} className="rounded-full" />
      <div className="flex items-center space-x-4">
        <span className="text-md font-semibold">{`${tokenTicker}/SOL`}</span>
        <Separator orientation="vertical" className="h-5 w-px bg-muted-foreground" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Image src="/images/tokens/solana.svg" alt="SOL" width={16} height={16} />
            <span className="text-sm">{`${formatLamports(price).toPrecision(3)} SOL ($${(solPrice * formatLamports(price)).toPrecision(3)})`}</span>
          </div>
          {/* <span className={`text-xs ${2.5 > 0 ? 'text-green-400' : 'text-red-500'}`}>24h: {2.5 > 0 ? '+' : ''}{2.5}%</span> */}
        </div>
        <Separator orientation="vertical" className="h-5 w-px bg-muted-foreground/50" />
        <div className="flex items-center gap-2">
            <a 
                href={`https://solscan.io/token/${contractAddress}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-muted-foreground hover:text-sky-500 cursor-pointer"
            >
                Token
            </a>
            <button
                onClick={() => {
                    navigator.clipboard.writeText(contractAddress);
                }}
                className="text-muted-foreground hover:text-sky-500 active:translate-y-0.5 active:scale-95 transition-transform"
            >
                <Copy className="h-3 w-3" />
            </button>
        </div>
        <Separator orientation="vertical" className="h-5 w-px bg-muted-foreground/50" />
        <div className="flex items-center gap-2">
        <a 
                href={`https://solscan.io/token/${contractAddress}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-muted-foreground hover:text-sky-500 cursor-pointer"
            >
                Pair
            </a>
            <button
                onClick={() => {
                    navigator.clipboard.writeText(contractAddress);
                }}
                className="text-muted-foreground hover:text-sky-500 active:translate-y-0.5 active:scale-95 transition-transform"
            >
                <Copy className="h-3 w-3" />
            </button>
        </div>
      </div>

    </div>
  )
}
  
  