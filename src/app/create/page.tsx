"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { useState } from "react"
import { InfoIcon } from "lucide-react"

export default function Create() {
//   const [selectedToken, setSelectedToken] = useState<string>("")

  return (
    <main className="container mx-auto py-12 max-w-6xl">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Create Attention Token
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Card - ATTENTION TOKEN DETAILS & SOCIALS */}
        <Card className="border border-gray-200 shadow-sm rounded-lg">
          <CardHeader className="pb-4 border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold">Attention Token Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input id="name" placeholder="Your Token Name" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticker" className="text-sm font-medium">
                  Ticker
                </Label>
                <Input id="ticker" placeholder="e.g. ATN" className="h-10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea 
                id="description" 
                placeholder="A short, compelling description of your token..."
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Token Image</Label>
              <label className="mt-3 flex items-center justify-center border border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-500 transition-colors cursor-pointer text-sm text-muted-foreground">
                <input type="file" accept="image/*" className="hidden" />
                Upload Image
              </label>
            </div>

            <div className="pt-8 border-t border-gray-200 space-y-6">
              <h2 className="text-xl font-semibold">Socials</h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-sm font-medium">Twitter</Label>
                  <Input id="twitter" placeholder="@handle" className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram" className="text-sm font-medium">Telegram</Label>
                  <Input id="telegram" placeholder="@handle" className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                  <Input id="website" placeholder="https://yourwebsite.com" className="h-10" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Card - QUOTE TOKEN & SETTINGS */}
        <Card className="border border-gray-200 shadow-sm rounded-lg">
          <CardHeader className="pb-4 border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold">Set Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">

            {/* <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quoteToken" className="text-sm font-medium">Select Token</Label>
                <Select onValueChange={setSelectedToken} value={selectedToken}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose a quote token" />
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
                  <Label htmlFor="contractAddress" className="text-sm font-medium">
                    Contract Address
                  </Label>
                  <Input id="contractAddress" placeholder="Enter contract address" className="h-10" />
                </div>
              )}

              <div className="space-y-2 pt-4">
                <Label htmlFor="basePrice" className="text-sm font-medium">
                  Base Price (PAIR / TOKEN)
                </Label>
                <Input id="basePrice" type="number" placeholder="0.0" className="h-10" />
              </div>
            </div> */}

            <div className="pt-4 border-gray-200 space-y-6">
              {/* <h2 className="text-xl font-semibold">Set Requests</h2> */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-medium text-base">Request #1</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 h-6">
                            <Label htmlFor="price" className="text-sm font-medium">Tokens Required</Label>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="space-y-1 text-sm">
                            <p>Number of tokens required for this request option.</p>
                            <p>Minimum tokens per request is 1000.</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Input id="price" placeholder="# tokens (min 1000)" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="optionDescription" className="text-sm font-medium">Description</Label>
                    <Input id="optionDescription" placeholder="e.g. sponsored post on X" className="h-10" />
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full h-10">
                + Add Request (Max 3)
              </Button>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <Button className="w-full h-12 bg-lime-500 hover:bg-lime-700 text-white text-sm font-medium">
                Create Token
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
