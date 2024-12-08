"use client"

import Image from "next/image"

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
import { Transaction, transactionData } from "@/app/markets/components/Mockdata"



interface TransactionsPanelProps {
  contractAddress: string;
}

export default function TransactionsPanel({ contractAddress }: TransactionsPanelProps) {
    // Filter transactions for this contract address
    const transactions: Transaction[] = transactionData.filter(
        tx => tx.contractAddress === contractAddress
    )

    return (
        <div className="w-full mt-2">
        <Tabs defaultValue="transactions" className="w-full">
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
            
            <TabsContent value="transactions" className="mt-0">
            <div>
                <Table className="text-sm">
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[120px] pl-7">DATE</TableHead>
                    <TableHead className="w-[100px]">TYPE</TableHead>
                    <TableHead className="w-[100px]">PRICE USD</TableHead>
                    <TableHead className="w-[100px]">TOTAL USD</TableHead>
                    <TableHead className="w-[100px]">PRICE SOL</TableHead>
                    <TableHead className="w-[100px]">AMOUNT</TableHead>
                    <TableHead className="w-[100px]">TOTAL SOL</TableHead>
                    <TableHead className="w-[120px]">TXN HASH</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-sm">
                    {transactions.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center">
                        No transactions found
                        </TableCell>
                    </TableRow>
                    ) : (
                    transactions.map((transaction, index) => (
                        <TableRow key={index}>
                        <TableCell className={`pl-7 ${transaction.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{transaction.date}</TableCell>
                        <TableCell className={transaction.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>{transaction.type}</TableCell>
                        <TableCell className={transaction.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>${transaction.priceUsd}</TableCell>
                        <TableCell className={transaction.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>${transaction.totalUsd}</TableCell>
                        <TableCell className={transaction.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>
                            <div className="flex items-center gap-3">
                            <Image src="/images/tokens/solana.svg" alt="SOL" width={14} height={14}/>
                            {transaction.priceSol}
                            </div>
                        </TableCell>
                        <TableCell className={transaction.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>{transaction.amount}</TableCell>
                        <TableCell className={transaction.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>
                            <div className="flex items-center gap-3">
                            <Image src="/images/tokens/solana.svg" alt="SOL" width={14} height={14} />
                            {transaction.totalSol}
                            </div>
                        </TableCell>
                        <TableCell>
                            <a
                            href={`https://solscan.io/tx/${transaction.txnHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center hover:text-lime-500 ${transaction.type === 'Buy' ? 'text-green-500' : 'text-red-500'}`}
                            >
                            {`${transaction.txnHash.slice(0, 6)}...${transaction.txnHash.slice(-4)}`}
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
  
  