"use client"

import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { sanitizeInput, calculateSol, calculateInput, calculateOutput } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { useWallet } from "@/contexts/WalletContext";
import { FactoryService } from "@/services/factory";
import { PublicKey } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useToast } from "@/hooks/use-toast";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { FACTORY_ADDRESS } from "@/config/contracts";

export default function ActionPanel({ 
    tokenTicker, 
    tokenImage,
    pairAddress,
    attentionToken,
    creatorPublicKey,
    basePrice,
}: { 
    tokenTicker: string, 
    tokenImage: string,
    pairAddress: string,
    attentionToken: string,
    creatorPublicKey: string,
    basePrice: number,
}) {
    const [isBuy, setIsBuy] = useState(true);
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");

    // to change when formula is finalized
    const [amount, setAmount] = useState<number>(0);
    const [amountOut, setAmountOut] = useState<number>(0);

    const { connected, wallet } = useWallet();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    // ============= MOCK DATA =============
    // TODO: get account and balances from wallet
    const account = "0x0000000000000000000000000000000000000000";
    const solBalance: number = 100000;
    const atnBalance: number = 100000;

    const pairToken = "SOL";

    // const maxSupply = 1000000;
    // const currentSupply = 500000;
    // const spread = 0.01;

    // ===================================

    const handleTabChange = (value: string) => {
        setIsBuy(value === "true");
        setInput("");
        setOutput("");
        setAmount(0);
    };

    const handleMaxSizeClick = () => {
        if (account) {
            //TODO: get sol balance from wallet
            if (isBuy) {
                handleInputChange({ target: { value: solBalance.toString() } } as React.ChangeEvent<HTMLInputElement>);
            } else {
                handleInputChange({ target: { value: atnBalance.toString() } } as React.ChangeEvent<HTMLInputElement>);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = sanitizeInput(e.target.value);
        setInput(sanitizedValue);
        if (isBuy) {
            /// @TODO: Need to determine formula for buy
            // const atnAmount = calculateSol(currentSupply, Number(sanitizedValue), minPrice, maxPrice, maxSupply, spread);
            const atnAmount = calculateOutput(Number(sanitizedValue), basePrice);
            if (atnAmount === 0) {
                setOutput("");
                setAmount(0);
                setAmountOut(0);
            } else {
                setOutput(atnAmount.toString());
                setAmount(Number(sanitizedValue) * LAMPORTS_PER_SOL);
                setAmountOut(atnAmount * LAMPORTS_PER_SOL);
            }
        } else {
            // const solAmount = calculateSol(currentSupply, -Number(sanitizedValue), minPrice, maxPrice, maxSupply, spread);
            const solAmount = calculateInput(Number(sanitizedValue), basePrice);
            if (solAmount === 0) {
                setOutput("");
                setAmount(0);
                setAmountOut(0);
            } else {
                setOutput(solAmount.toString());
                setAmount(Number(sanitizedValue) * LAMPORTS_PER_SOL);
                setAmountOut(solAmount * LAMPORTS_PER_SOL);
            }
        }
    };

    const handleOutputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = sanitizeInput(e.target.value);
        setOutput(sanitizedValue);
        if (isBuy) {
            // const solAmount = calculateSol(currentSupply, Number(sanitizedValue), minPrice, maxPrice, maxSupply, spread);
            const solAmount = calculateInput(Number(sanitizedValue), basePrice);
            if (solAmount === 0) {
                setInput("");
                setAmount(0);
                setAmountOut(0);
            } else {
                setInput(solAmount.toString());
                setAmount(solAmount * LAMPORTS_PER_SOL);
                setAmountOut(Number(sanitizedValue) * LAMPORTS_PER_SOL);
            }
        } else {
            // @TODO: Need to determine formula for sell if sol is used as an input
            // const atnAmount = calculateSol(currentSupply, -Number(sanitizedValue), minPrice, maxPrice, maxSupply, spread);
            const atnAmount = calculateInput(Number(sanitizedValue), basePrice);
            if (atnAmount === 0) {
                setInput("");
                setAmount(0);
                setAmountOut(0);
            } else {
                setInput(atnAmount.toString());
                setAmount(atnAmount * LAMPORTS_PER_SOL);
                setAmountOut(Number(sanitizedValue) * LAMPORTS_PER_SOL);
            }
        }
    };

    const handleSwap = async () => {
        if (!connected || !wallet) {
            toast({
                title: "Error",
                description: "Please connect your wallet to continue",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsLoading(true);
            const factoryService = new FactoryService();
            const amountIn = Number(input);
            const minimumAmountOut = Number(output);

            // Get user's token account
            const userTokenAccount = await getAssociatedTokenAddress(
                new PublicKey(attentionToken),
                new PublicKey(wallet.publicKey.toString())
            );

            const { signature } = await factoryService.swap(
                wallet,
                amountIn * LAMPORTS_PER_SOL,
                minimumAmountOut * LAMPORTS_PER_SOL,
                isBuy,
                new PublicKey(pairAddress),
                new PublicKey(attentionToken),
                userTokenAccount,
                new PublicKey(creatorPublicKey),
                new PublicKey(FACTORY_ADDRESS)
            );

            toast({
                title: "Success!",
                description: (
                    <>
                        Transaction successful!
                        <br />
                        <a 
                            href={`https://solscan.io/tx/${signature}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lime-500 hover:underline"
                        >
                            View transaction
                        </a>
                    </>
                ),
            });

            // Reset form
            setInput("");
            setOutput("");
            setAmount(0);

        } catch (error) {
            console.error('Swap failed:', error);
            toast({
                title: "Error",
                description: error instanceof Error 
                    ? error.message 
                    : "Failed to complete swap. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <Tabs defaultValue="buy"
                className="w-[400px] h-[58px] flex items-center justify-center m-2"
                onValueChange={handleTabChange}
                value={isBuy.toString()}
            >
                <TabsList className="grid w-full grid-cols-2 h-full rounded-md overflow-hidden">
                    <TabsTrigger value="true" className="text-sm h-full data-[state=active]:bg-lime-600 data-[state=active]:text-white">Buy</TabsTrigger>
                    <TabsTrigger value="false" className="text-sm h-full data-[state=active]:bg-lime-600 data-[state=active]:text-white">Sell</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="flex flex-col mt-4 mx-4 mb-2">
                <div className="flex justify-between items-center m-2 text-muted-foreground">
                    <Label className="text-sm">Amount ({isBuy ? 'SOL' : tokenTicker})</Label>
                    <Button
                        variant="link"
                        size="sm"
                        onClick={handleMaxSizeClick}
                        disabled={!account || (isBuy ? solBalance : atnBalance) === 0}
                        className="h-6 px-2 text-sm text-lime-500"
                    >
                        Balance: {isBuy ? solBalance : atnBalance} {isBuy ? pairToken : tokenTicker}
                    </Button>
                </div>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Image src={isBuy ? "/images/tokens/solana.svg" : tokenImage} alt={isBuy ? "SOL" : tokenTicker} width={20} height={20} />
                    </div>
                    <Input
                        type="text"
                        placeholder={`Amount to ${isBuy ? 'buy' : 'sell'} in ${isBuy ? pairToken : tokenTicker}`}
                        className="h-12 text-left pl-10"
                        onChange={handleInputChange}
                        value={input}
                    />
                </div>
                
            </div>
            <div className="flex justify-center items-center">  
                <ArrowDown className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex flex-col mb-6 mx-4 mt-2">
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Image src={isBuy ? tokenImage : "/images/tokens/solana.svg"} alt={isBuy ? tokenTicker : "SOL"} width={20} height={20} />
                    </div>
                    <Input
                        type="text"
                        placeholder={`Amount to receive in ${isBuy ? tokenTicker : pairToken}`}
                        className="h-12 text-left pl-10"
                        onChange={handleOutputChange}
                        value={output}
                    />
                </div>
            </div>
            <div className="flex flex-col m-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex w-full justify-center items-center">
                            <Button 
                                className={`w-full h-12 text-sm font-medium ${
                                    connected 
                                    ? "bg-lime-500 hover:bg-lime-700 text-white" 
                                    : "bg-gray-400 text-gray-100"
                                }`}
                                disabled={!connected || isLoading || amount === 0 || amountOut === 0} 
                                onClick={handleSwap}
                            >
                                {isLoading ? "Processing..." : (isBuy ? "Buy" : "Sell")}
                            </Button>
                        </div>
                    </TooltipTrigger>
                    {!connected && (
                        <TooltipContent side="bottom">
                            <p>Please connect your wallet to continue</p>
                        </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
  }
  
  