"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { InfoIcon } from "lucide-react"

export default function Create() {
  const [selectedToken, setSelectedToken] = useState<string>("")

  return (
    <main className="container mx-auto py-10 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Create Attention Token</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Card - ATN TOKEN & SOCIALS */}
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Atn Token Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Token name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticker">Ticker</Label>
                <Input id="ticker" placeholder="Token ticker" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Token description" 
                className="min-h-[100px] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Token Image</Label>
              <div className="mt-2 flex items-center justify-center border-2 border-dashed rounded-lg p-8 bg-muted/50">
                <Button variant="outline">Upload Image</Button>
              </div>
            </div>

            <div className="pt-8 border-t space-y-6">
              <CardTitle className="text-xl">Socials</CardTitle>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" placeholder="@handle" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input id="telegram" placeholder="@handle" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="https://" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Card - QUOTE TOKEN & SETTINGS */}
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Quote Token</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quoteToken">Select Token</Label>
                <Select onValueChange={setSelectedToken} value={selectedToken}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sol">SOL</SelectItem>
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="custom">Custom Token</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedToken === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="contractAddress">Contract Address</Label>
                  <Input id="contractAddress" placeholder="Enter contract address" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price (PAIR / TOKEN)</Label>
                <Input id="basePrice" type="number" placeholder="0.0" className="h-12" />
                </div>
            </div>

            <div className="pt-4 border-t space-y-6">
              <div className="space-y-6">

                <CardTitle className="text-xl">Set Requests</CardTitle>
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold">Request #1</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 h-6">
                              <Label htmlFor="price">Price</Label>
                              <InfoIcon className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="top" 
                          >
                            <div className="space-y-1">
                              <p className="text-sm">Number of attention tokens required for this request option.</p>
                              <p className="text-sm">Min price per request: X Sol</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Input id="price" placeholder="#tokens" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-6">
                        <Label htmlFor="optionDescription">Description</Label>
                      </div>
                      <Input id="optionDescription" placeholder="e.g. sponsored post on X" />
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  + Add Request
                </Button>
              </div>
            </div>

            <div className="pt-8 border-t">
              <Button className="w-full h-12 text-sm">Create</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 