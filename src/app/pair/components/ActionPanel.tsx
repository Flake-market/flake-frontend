"use client"

import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { sanitizeInput } from "@/lib/utils";

export default function ActionPanel() {
    const [isBuy, setIsBuy] = useState(true);
    const [input, setInput] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    // TODO: get account from wallet
    let account = "0x0000000000000000000000000000000000000000";
    let solBalance = 100000;

    const handleMaxSizeClick = () => {
        if (account) {
            //TODO: get sol balance from wallet
            setAmount(solBalance);
            setInput(solBalance.toString());
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = sanitizeInput(e.target.value);
        setAmount(Number(sanitizedValue));
        setInput(sanitizedValue);
    };

    return (
        <div className="mt-4">
            <Tabs defaultValue="buy"
                className="w-[400px] h-[58px] flex items-center justify-center m-2"
                onValueChange={(value) => setIsBuy(value === 'true')}
                value={isBuy.toString()}
            >
                <TabsList className="grid w-full grid-cols-2 h-full rounded-md overflow-hidden">
                    <TabsTrigger value="true" className="text-sm h-full data-[state=active]:bg-lime-600 data-[state=active]:text-white">Buy</TabsTrigger>
                    <TabsTrigger value="false" className="text-sm h-full data-[state=active]:bg-lime-600 data-[state=active]:text-white">Sell</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="flex flex-col m-4">
                <div className="flex justify-between items-center m-2 text-muted-foreground">
                    <Label className="text-sm">Amount (SOL)</Label>
                    <Button
                        variant="link"
                        size="sm"
                        onClick={handleMaxSizeClick}
                        disabled={!account || solBalance === 0}
                        className="h-6 px-2 text-sm text-lime-500"
                    >
                        Balance: {solBalance} SOL
                    </Button>
                </div>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Image src="/images/tokens/solana.svg" alt="SOL" width={20} height={20} />
                    </div>
                    <Input
                        type="text"
                        placeholder="Amount to buy in SOL"
                        className="h-12 text-left pl-10"
                        onChange={handleInputChange}
                        value={input}
                    />
                </div>
            </div>
            <div className="flex flex-col m-4">
                <Button className="bg-lime-500 text-white">
                    {isBuy ? "Buy" : "Sell"}
                </Button>
            </div>
        </div>
    )
  }
  
  