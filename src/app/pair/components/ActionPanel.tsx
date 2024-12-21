"use client"

import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { sanitizeInput, exactSolToTokens, exactTokensToSol, tokensToExactSol, solToExactTokens, parseLamports } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { useWallet } from "@/contexts/WalletContext";
import { FactoryService } from "@/services/factory";
import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useToast } from "@/hooks/use-toast";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { FACTORY_ADDRESS } from "@/config/contracts";
import { Loader2 } from "lucide-react";

export default function ActionPanel({ 
    tokenTicker, 
    tokenImage,
    pairAddress,
    attentionToken,
    creatorPublicKey,
    currentSupply,
    onTransactionSuccess
}: { 
    tokenTicker: string, 
    tokenImage: string,
    pairAddress: string,
    attentionToken: string,
    creatorPublicKey: string,
    currentSupply: number,
    onTransactionSuccess: () => Promise<void>
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
    
    const [solBalance, setSolBalance] = useState<number>(0);
    const [atnBalance, setAtnBalance] = useState<number>(0);
    const slippage: number = 0.05;
    const pairToken = "SOL";

    // ===================================

    const fetchBalances = async () => {
        if (connected && wallet?.publicKey) {
            try {
                const connection = new Connection("https://api.devnet.solana.com", "confirmed");
                
                // Fetch SOL balance
                const solBalance = await connection.getBalance(new PublicKey(wallet.publicKey.toString()));
                setSolBalance(solBalance / LAMPORTS_PER_SOL);
                
                // Fetch ATN balance
                const ata = await getAssociatedTokenAddress(
                    new PublicKey(attentionToken),
                    new PublicKey(wallet.publicKey.toString())
                );
                
                try {
                    const tokenBalance = await connection.getTokenAccountBalance(ata);
                    setAtnBalance(Number(tokenBalance.value.uiAmount || 0));
                } catch (error) {
                    // If token account doesn't exist yet, balance is 0
                    console.error('Error fetching ATN balance:', error);
                    setAtnBalance(0);
                }
                
            } catch (error) {
                console.error('Error fetching balances:', error);
                setSolBalance(0);
                setAtnBalance(0);
            }
        } else {
            setSolBalance(0);
            setAtnBalance(0);
        }
    };

    useEffect(() => {
        fetchBalances();
    }, [connected, wallet?.publicKey, attentionToken]);

    const handleTabChange = (value: string) => {
        setIsBuy(value === "true");
        setInput("");
        setOutput("");
        setAmount(0);
    };

    const handleMaxSizeClick = () => {
        if (wallet?.publicKey) {
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
            const atnAmount = exactSolToTokens(Number(currentSupply), Number(sanitizedValue));
            if (atnAmount === 0) {
                setOutput("");
                setAmount(0);
                setAmountOut(0);
            } else {
                setOutput((atnAmount * (1 - slippage)).toString());
                setAmount(parseLamports(Number(sanitizedValue)));
                setAmountOut(parseLamports(atnAmount * (1 - slippage)));
            }
        } else {
            // const solAmount = calculateSol(currentSupply, -Number(sanitizedValue), minPrice, maxPrice, maxSupply, spread);
            const solAmount = exactTokensToSol(currentSupply, Number(sanitizedValue));
            if (solAmount === 0) {
                setOutput("");
                setAmount(0);
                setAmountOut(0);
            } else {
                setOutput((solAmount * (1 - slippage)).toString());
                setAmount(parseLamports(Number(sanitizedValue)));
                setAmountOut(parseLamports(solAmount * (1 - slippage)));
            }
        }
    };

    const handleOutputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = sanitizeInput(e.target.value);
        setOutput(sanitizedValue);
        if (isBuy) {
            // const solAmount = calculateSol(currentSupply, Number(sanitizedValue), minPrice, maxPrice, maxSupply, spread);
            const solAmount = solToExactTokens(currentSupply, Number(sanitizedValue));
            if (solAmount === 0) {
                setInput("");
                setAmount(0);
                setAmountOut(0);
            } else {
                setInput((solAmount * (1 + slippage)).toString());
                setAmount(parseLamports(solAmount * (1 + slippage)));
                setAmountOut(parseLamports(Number(sanitizedValue)));
            }
        } else {
            // @TODO: Need to determine formula for sell if sol is used as an input
            // const atnAmount = calculateSol(currentSupply, -Number(sanitizedValue), minPrice, maxPrice, maxSupply, spread);
            const atnAmount = tokensToExactSol(currentSupply, Number(sanitizedValue));
            if (atnAmount === 0) {
                setInput("");
                setAmount(0);
                setAmountOut(0);
            } else {
                setInput((atnAmount * (1 + slippage)).toString());
                setAmount(parseLamports(atnAmount * (1 + slippage)));
                setAmountOut(parseLamports(Number(sanitizedValue)));
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

            // Get user's token account
            const userTokenAccount = await getAssociatedTokenAddress(
                new PublicKey(attentionToken),
                new PublicKey(wallet.publicKey.toString())
            );

            const { signature } = await factoryService.swap(
                wallet,
                amount,
                amountOut,
                isBuy,
                new PublicKey(pairAddress),
                new PublicKey(attentionToken),
                userTokenAccount,
                new PublicKey(creatorPublicKey),
                new PublicKey(FACTORY_ADDRESS)
            );

            // Add delay before showing success and refreshing data
            await new Promise(resolve => setTimeout(resolve, 700));

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

            // After successful transaction
            await onTransactionSuccess();
            await fetchBalances();

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
                        disabled={!wallet?.publicKey || (isBuy ? solBalance : atnBalance) === 0}
                        className="h-6 px-2 text-sm text-lime-500"
                    >
                        Balance: {isBuy ? solBalance : atnBalance} {isBuy ? pairToken : tokenTicker}
                    </Button>
                </div>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Image src={isBuy ? "/images/tokens/solana.svg" : tokenImage} alt={isBuy ? "SOL" : tokenTicker} width={20} height={20} className={!isBuy ? "rounded-full" : ""} />
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
                        <Image src={isBuy ? tokenImage : "/images/tokens/solana.svg"} alt={isBuy ? tokenTicker : "SOL"} width={20} height={20} className={isBuy ? "rounded-full" : ""} />
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
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Loading...
                                    </div>
                                ) : (
                                    isBuy ? "Buy" : "Sell"
                                )}
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
  
  