"use client"
import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'
import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// TODO: Remove mock data
import { data as mockData } from "@/app/markets/components/Mockdata";

// Mock data for requests (replace with actual data fetching)
interface Request {
  txnHash: string;
  amount: string;
  status: "Pending" | "Completed" | "Rejected";
  age: string;
}

const mockRequests: Request[] = [
  {
    txnHash: "REQ1234ABCD5678EFGH",
    amount: "1000 VTL",
    status: "Pending",
    age: "10 minutes",
  },
  {
    txnHash: "REQMNOP1234QRST5678",
    amount: "2000 VTL",
    status: "Completed",
    age: "1 hour",
  },
];

export default function RequestPage() {
  const [pairData, setPairData] = useState<any>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");

  const params = useParams();

  useEffect(() => {
    // Fetch pair data based on address
    const fetchPairData = () => {
      const pair = mockData.find(item => item.contractAddress === params.address);
      setPairData(pair || null) ;
    };

    fetchPairData();

    // Fetch requests data - replace with actual data fetching
    setRequests(mockRequests);

  }, [params.address]);

  if (!pairData) return <div>Pair not found</div>;

  const filteredRequests = requests.filter(request => {
    if (statusFilter === "all") return true;
    if (statusFilter === "pending") return request.status === "Pending";
    return request.status === "Completed";
  });

  return (
    <div className="container mx-auto mt-10">
      {/* Top Section */}
      <div className="flex justify-between">
        {/* Left Side */}
        <div className="mb-8 w-1/2">
          <h1 className="text-2xl mb-4 flex items-center gap-2">
            {pairData.tokenName}
          </h1>
          <div className="flex flex-col gap-2">
            {/* Contract Address with link to Solscan */}
            <a
              href={`https://solscan.io/address/${pairData.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-lime-500 hover:underline"
            >
              {pairData.contractAddress}
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
          <button className="bg-lime-500 text-white px-8 py-2 rounded-md mt-4 hover:bg-lime-600 transition-colors">
            Request
          </button>
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
            Completed Requests: {requests.filter(r => r.status === "Completed").length}
          </p>
          {/* Filter Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-1 text-sm rounded-md transition-colors ${
                statusFilter === "all"
                  ? "border-2 border-lime-500 text-lime-500"
                  : "border-2 border-muted-foreground text-muted-foreground hover:border-gray-500 hover:text-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-1 text-sm rounded-md transition-colors ${
                statusFilter === "pending"
                  ? "border-2 border-lime-500 text-lime-500"
                  : "border-2 border-muted-foreground text-muted-foreground hover:border-gray-500 hover:text-gray-600"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-4 py-1 text-sm rounded-md transition-colors ${
                statusFilter === "completed"
                  ? "border-2 border-lime-500 text-lime-500"
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
              <TableHead className="w-1/6">AMOUNT</TableHead>
              <TableHead className="w-1/6">STATUS</TableHead>
              <TableHead className="w-1/6">AGE</TableHead>
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
                  <TableCell className="pl-7" >
                    <a
                      href={`https://solscan.io/tx/${request.txnHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-lime-500 hover:underline"
                    >
                      {`${request.txnHash.slice(0, 6)}...${request.txnHash.slice(-4)}`}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>{request.amount}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>{request.age}</TableCell>
                  <TableCell>
                    <button
                      className={`border-2 border-red-500 text-red-500 px-4 py-1.5 rounded-md transition-colors w-36 ${
                        request.status === "Completed" ? "opacity-50 cursor-not-allowed" : "hover:bg-red-500 hover:text-white"
                      }`}
                      disabled={request.status === "Completed"}
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
  );
}