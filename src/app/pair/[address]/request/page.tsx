"use client"
import { useState, useEffect, useMemo } from "react"
import { useParams } from 'next/navigation'
import { ExternalLink } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "@/contexts/WalletContext";
import { PublicKey } from "@solana/web3.js";
import { FactoryService } from "@/services/factory";
import { useToast } from "@/hooks/use-toast";

import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RequireWallet } from "@/components/auth/RequireWallet"
import { PairData } from "@/app/markets/types/MarketTypes"
import { MarketService } from "@/services/marketService"
import { Request } from "@/app/pair/types/RequestTypes";
import { RequestService } from "@/services/requestService";
import { LoadingScreen } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";

export default function RequestPage() {
  const [pairData, setPairData] = useState<PairData | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [open, setOpen] = useState(false);
  const [adText, setAdText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const params = useParams();
  const { connected, wallet} = useWallet();
  const { toast } = useToast();
  const marketService = useMemo(() => new MarketService(), []);
  const requestService = useMemo(() => new RequestService(), []);
  const factoryService = useMemo(() => new FactoryService(), []);

  const fetchRequests = async (pairKey: string) => {
    if (!wallet?.publicKey) return;
    const requestsData = await requestService.getRequestsByPairAndUser(
      pairKey,
      wallet.publicKey.toString()
    );
    setRequests(requestsData);
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true);
        const pair = await marketService.getPairByKey(params.address as string);
        setPairData(pair || null);

        if (pair && connected && wallet?.publicKey) {
          await fetchRequests(pair.pairKey);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [params.address, marketService, requestService, wallet, connected]);

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  if (!pairData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-destructive">Pair not found</span>
      </div>
    );
  }

  const filteredRequests = requests
    .filter(request => {
      if (statusFilter === "all") return true;
      if (statusFilter === "pending") return request.status === "Pending";
      return request.status === "Accepted";
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSubmitRequest = async () => {
    if (!connected || !wallet || !pairData || !adText.trim()) return;

    try {
      setIsSubmitting(true);
      await factoryService.submitRequest(
        wallet,
        new PublicKey(pairData.pairKey),
        new PublicKey(pairData.attentionToken),
        new PublicKey(pairData.creator),
        0,
        adText.trim()
      );
      toast({
        title: "Success!",
        description: "Request submitted successfully!"
      });
      setOpen(false);
      setAdText("");
      
      await fetchRequests(pairData.pairKey);
      
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
          title: "Error",
          description: "Failed to submit request. Please try again.",
          variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRowExpansion = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <RequireWallet>
      <div className="container mx-auto mt-10">
        {/* Top Section */}
        <div className="flex justify-between">
          {/* Left Side */}
          <div className="mb-8 w-1/2">
            <h1 className="text-2xl mb-4 flex items-center gap-2">
              {pairData.name}
            </h1>
            <div className="flex flex-col gap-2">
              {/* Contract Address with link to Solscan */}
              <a
                href={`https://solscan.io/address/${pairData.pairKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-grey-500 hover:underline"
              >
                {pairData.pairKey}
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
              {/* Description from mockData */}
              <p className="max-w-[600px]">{pairData.description}</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="mb-8 w-1/2">
            <h2 className="text-xl mb-2">Sponsored Post</h2>
            <p className="text-muted-foreground">
              Get a sponsored post on X.
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
              <Button 
                className="h-12 text-sm font-medium bg-zinc-900 border border-black text-white hover:bg-zinc-900/80">
                Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Details</DialogTitle>
                </DialogHeader>
                <Textarea
                  placeholder="Input your text request: E.g. X sponsored post regarding my AI Agent X on Solana"
                  className="w-full h-40"
                  value={adText}
                  onChange={(e) => setAdText(e.target.value)}
                />
                <Button 
                  className={`bg-zinc-900 border text-white px-8 py-2 rounded-md mt-4 border border-black text-white ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-grey-600'
                  }`}
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting || !adText.trim()}
                >
                  {isSubmitting ? 'Submitting...' : `1000 ${pairData?.ticker}`}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator />

        {/* Bottom Section */}
        <div className="mt-6">
          <h1 className="text-2xl mb-4">Manage Requests</h1>
          <div className="flex flex-col gap-2 mb-4">
            <p className="text-muted-foreground">
              Pending Requests: {requests.filter(r => r.status === "Pending").length}
            </p>
            <p className="text-muted-foreground">
              Completed Requests: {requests.filter(r => r.status === "Accepted").length}
            </p>
            {/* Filter Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-1 text-sm rounded-md transition-colors ${
                  statusFilter === "all"
                    ? "border-2 border-grey-500 text-grey-500"
                    : "border-2 border-muted-foreground text-muted-foreground hover:border-gray-500 hover:text-gray-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-4 py-1 text-sm rounded-md transition-colors ${
                  statusFilter === "pending"
                    ? "border-2 border-grey-500 text-grey-500"
                    : "border-2 border-muted-foreground text-muted-foreground hover:border-gray-500 hover:text-gray-600"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter("completed")}
                className={`px-4 py-1 text-sm rounded-md transition-colors ${
                  statusFilter === "completed"
                    ? "border-2 border-grey-500 text-grey-500"
                    : "border-2 border-muted-foreground text-muted-foreground hover:border-gray-500 hover:text-gray-600"
                }`}
              >
                Completed
              </button>
            </div>
          </div>
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-7 w-1/4">REQUEST</TableHead>
                <TableHead className="w-1/6">STATUS</TableHead>
                <TableHead className="w-1/6">CREATED</TableHead>
                <TableHead className="w-1/6">LAST UPDATED</TableHead>
                <TableHead className="w-1/12">WITHDRAW</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell className="pl-7">
                      <div className="text-sm text-muted-foreground">
                        {expandedRows.has(index) ? request.adText : `${request.adText.slice(0, 50)}...`}{" "}
                        <button 
                          className="text-grey-500 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(index);
                          }}
                        >
                          {expandedRows.has(index) ? '[see less]' : '[see more]'}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(request.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <button
                        className={`border-2 px-4 py-1.5 rounded-md transition-colors w-36 ${
                          request.status !== "Pending" 
                            ? "border-gray-500 text-gray-500 opacity-50 cursor-not-allowed" 
                            : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        }`}
                        disabled={request.status !== "Pending"}
                      >
                        Withdraw
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </RequireWallet>
  );
}