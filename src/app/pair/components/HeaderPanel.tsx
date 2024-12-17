"use client"
import Image from 'next/image';
import { Separator } from "@/components/ui/separator"
import { Copy } from "lucide-react"

interface HeaderPanelProps {
  contractAddress: string;
  tokenTicker: string;
  price: number;
  tokenImage: string;
}

export default function HeaderPanel({ contractAddress, tokenTicker, price, tokenImage }: HeaderPanelProps) {
  return (
    <div className="flex items-center h-full mx-2 px-4 space-x-4">
      <Image src={tokenImage} alt={`${tokenTicker} logo`} width={32} height={32} />
      <div className="flex items-center space-x-4">
        <span className="text-md font-semibold">{`${tokenTicker}/SOL`}</span>
        <Separator orientation="vertical" className="h-5 w-px bg-muted-foreground" />
        <div className="flex flex-col">
          <span className={`text-sm ${2.5 > 0 ? 'text-green-400' : 'text-red-500'}`}>{`${price} SOL ($${(250 * price).toFixed(2)})`}</span>
          <span className={`text-xs ${2.5 > 0 ? 'text-green-400' : 'text-red-500'}`}>24h: {2.5 > 0 ? '+' : ''}{2.5}%</span>
        </div>
        <Separator orientation="vertical" className="h-5 w-px bg-muted-foreground/50" />
        <div className="flex items-center gap-2">
            <a 
                href={`https://solscan.io/token/${contractAddress}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-muted-foreground hover:text-lime-400 cursor-pointer"
            >
                Token
            </a>
            <button
                onClick={() => {
                    navigator.clipboard.writeText(contractAddress);
                }}
                className="text-muted-foreground hover:text-lime-400 active:translate-y-0.5 active:scale-95 transition-transform"
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
                className="text-sm text-muted-foreground hover:text-lime-400 cursor-pointer"
            >
                Pair
            </a>
            <button
                onClick={() => {
                    navigator.clipboard.writeText(contractAddress);
                }}
                className="text-muted-foreground hover:text-lime-400 active:translate-y-0.5 active:scale-95 transition-transform"
            >
                <Copy className="h-3 w-3" />
            </button>
        </div>
      </div>

    </div>
  )
}
  
  