"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"
import { useState, ChangeEvent } from "react"
import { FactoryService, CreateTokenParams } from "@/services/factory";
import { useToast } from "@/hooks/use-toast";

export default function Create() {
  const { connected, connect, wallet } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<CreateTokenParams>({
    name: "Isha",
    ticker: "ISHA",
    description: "A decentralized token for the community",
    token_image: "",
    socials: {
      twitter: "@ishatoken",
      telegram: "@ishaofficial", 
      website: "ishatoken.xyz",
    },
    base_price: 1_000_000,
    requests: [{
      price: 1000,
      description: "sponsored post on X",
    }]
  });

  // New state for the selected image file and uploaded image URL
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [field]: value
      }
    }));
  };

  const handleRequestChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      requests: prev.requests.map((request, i) => 
        i === index ? { ...request, [field]: value } : request
      )
    }));
  };

  // Handler for file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Function to upload image to Pinata via API route
  const uploadImageToPinata = async () => {
    if (!selectedImage) return null;

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch("/api/pinata", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      console.log("data", data)
      setUploadedImageUrl(`https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`);
      return data.IpfsHash;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Image upload failed",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleCreateToken = async () => {
    if (!connected) {
      connect();
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.ticker) {
      toast({
        title: "Error",
        description: "Name and ticker are required",
        variant: "destructive",
      });
      return;
    }

    // Upload image to Pinata
    const cid = await uploadImageToPinata();
    if (!cid) {
      // Image upload failed; stop token creation
      return;
    }

    // Update formData with the uploaded image URL
    const updatedFormData = {
      ...formData,
      token_image: `https://gateway.pinata.cloud/ipfs/${cid}`,
    };

    try {
      setIsLoading(true);
      const factoryService = new FactoryService();
      if (!wallet) {
        throw new Error("Wallet not connected");
      }
      const { pairAddress, signature } = await factoryService.createToken(wallet, updatedFormData);
      if (!signature || !pairAddress) {
        throw new Error("Transaction failed - no signature or pair address returned");
      }

      toast({
        title: "Success!",
        description: (
          <>
            Token created successfully!
            <br />
            Pair Address:{" "}
            <a
              href={`https://solscan.io/account/${pairAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime-500 hover:underline"
            >
              {pairAddress.slice(0, 20)}...
            </a>
            <br />
            Signature:{" "}
            <a 
              href={`https://solscan.io/tx/${signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime-500 hover:underline"
            >
              {signature.slice(0, 20)}...
            </a>
          </>
        ),
      });
    } catch (error) {
      console.error("Error creating token:", error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to create token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your Token Name" 
                    className="h-10" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticker" className="text-sm font-medium">
                    Ticker
                  </Label>
                  <Input 
                    id="ticker" 
                    value={formData.ticker}
                    onChange={(e) => handleInputChange('ticker', e.target.value)}
                    placeholder="e.g. ATN" 
                    className="h-10" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea 
                  id="description" 
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="A short, compelling description of your token..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Token Image</Label>
                <label
                  htmlFor="tokenImage"
                  className="mt-3 flex items-center justify-center border border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-500 transition-colors cursor-pointer text-sm text-muted-foreground"
                >
                  <input
                    id="tokenImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {selectedImage ? selectedImage.name : "Upload Image"}
                </label>
                {uploadedImageUrl && (
                  <img src={uploadedImageUrl} alt="Uploaded Token" className="mt-4 w-32 h-32 object-cover" />
                )}
              </div>

              <div className="pt-8 border-t border-gray-200 space-y-6">
                <h2 className="text-xl font-semibold">Socials</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-sm font-medium">Twitter</Label>
                    <Input 
                      id="twitter" 
                      value={formData.socials.twitter}
                      onChange={(e) => handleSocialChange('twitter', e.target.value)}
                      placeholder="@handle" 
                      className="h-10" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telegram" className="text-sm font-medium">Telegram</Label>
                    <Input 
                      id="telegram" 
                      value={formData.socials.telegram}
                      onChange={(e) => handleSocialChange('telegram', e.target.value)}
                      placeholder="@handle" 
                      className="h-10" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                    <Input 
                      id="website" 
                      value={formData.socials.website}
                      onChange={(e) => handleSocialChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com" 
                      className="h-10" 
                    />
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
                      <Input 
                        id="price" 
                        value={formData.requests[0].price}
                        onChange={(e) => handleRequestChange(0, 'price', e.target.value)}
                        placeholder="# tokens (min 1000)" 
                        className="h-10" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="optionDescription" className="text-sm font-medium">Description</Label>
                      <Input 
                        id="optionDescription" 
                        value={formData.requests[0].description}
                        onChange={(e) => handleRequestChange(0, 'description', e.target.value)}
                        placeholder="e.g. sponsored post on X" 
                        className="h-10" 
                      />
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full h-10">
                  + Add Request (Max 3)
                </Button>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <Button 
                          onClick={handleCreateToken}
                          className={`w-full h-12 text-sm font-medium ${
                            connected 
                              ? "bg-lime-500 hover:bg-lime-700 text-white" 
                              : "bg-gray-400 text-gray-100"
                          }`}
                          disabled={!connected || isLoading}
                        >
                          {isLoading ? "Creating..." : "Create Token"}
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
            </CardContent>
          </Card>
        </div>
      </main>
  )
}
