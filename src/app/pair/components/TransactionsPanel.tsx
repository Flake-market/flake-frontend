"use client"

import { useEffect, useState } from "react"
import { SwapService } from "@/services/swapService"
import { Swap } from "../types/SwapTypes"
import { formatLamports } from "@/lib/utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink } from "lucide-react"

interface TransactionsPanelProps {
  pairKey: string;
}

export default function TransactionsPanel({ pairKey }: TransactionsPanelProps) {
    const [swaps, setSwaps] = useState<Swap[]>([])
    const swapService = new SwapService()

    useEffect(() => {
        const fetchSwaps = async () => {
            const swapData = await swapService.getSwapsByPair(pairKey)
            setSwaps(swapData)
        }
        fetchSwaps()
    }, [pairKey])

    return (
        <div className="w-full h-full">
        <Tabs defaultValue="transactions" className="w-full h-full flex flex-col">
            <div className="border-b">
            <TabsList className="h-auto w-full justify-start space-x-6 bg-transparent px-4 rounded-none pb-0">
                <TabsTrigger 
                value="transactions" 
                className="h-9 bg-transparent pb-3 text-muted-foreground text-base rounded-none data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary"
                >
                Transactions
                </TabsTrigger>
                <TabsTrigger 
                value="positions" 
                className="h-9 bg-transparent pb-3 text-muted-foreground text-base rounded-none data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-primary"
                >
                Positions
                </TabsTrigger>
            </TabsList>
            </div>
            
            <TabsContent value="transactions" className="mt-0 flex-1 overflow-auto">
            <div>
                <Table className="text-xs">
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[120px] pl-7">DATE</TableHead>
                    <TableHead className="w-[100px]">TYPE</TableHead>
                    <TableHead className="w-[100px]">AMOUNT IN</TableHead>
                    <TableHead className="w-[100px]">TOKEN IN</TableHead>
                    <TableHead className="w-[100px]">AMOUNT OUT</TableHead>
                    <TableHead className="w-[100px]">TOKEN OUT</TableHead>
                    <TableHead className="w-[100px]">AVG PRICE</TableHead>
                    <TableHead className="w-[120px]">USER</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                    {swaps.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center">
                        No transactions found
                        </TableCell>
                    </TableRow>
                    ) : (
                    swaps.map((swap, index) => (
                        <TableRow key={index}>
                        <TableCell className={`pl-7 ${swap.isBuy ? 'text-green-500' : 'text-red-500'}`}>
                            {new Date(swap.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className={swap.isBuy ? 'text-green-500' : 'text-red-500'}>
                            {swap.isBuy ? 'Buy' : 'Sell'}
                        </TableCell>
                        <TableCell className={swap.isBuy ? 'text-green-500' : 'text-red-500'}>
                            {formatLamports(swap.amountIn).toPrecision(5)}
                        </TableCell>
                        <TableCell className={swap.isBuy ? 'text-green-500' : 'text-red-500'}>
                            {swap.tokenIn}
                        </TableCell>
                        <TableCell className={swap.isBuy ? 'text-green-500' : 'text-red-500'}>
                            {formatLamports(swap.amountOut).toPrecision(5)}
                        </TableCell>
                        <TableCell className={swap.isBuy ? 'text-green-500' : 'text-red-500'}>
                            {swap.tokenOut}
                        </TableCell>
                        <TableCell className={swap.isBuy ? 'text-green-500' : 'text-red-500'}>
                            {swap.averagePrice.toPrecision(5)} SOL
                        </TableCell>
                        <TableCell>
                            <a
                            href={`https://solscan.io/account/${swap.user}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center hover:text-grey-500 ${swap.isBuy ? 'text-green-500' : 'text-red-500'}`}
                            >
                            {`${swap.user.slice(0, 6)}...${swap.user.slice(-4)}`}
                            <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </TableCell>
                        </TableRow>
                    ))
                    )}
                    <TableRow>
                    </TableRow>
                </TableBody>
                </Table>
            </div>
            </TabsContent>
            
            <TabsContent value="positions">
            <div className="text-center text-muted-foreground">
                Positions will be displayed here
            </div>
            </TabsContent>
        </Tabs>
        </div>
    )
}
  
  