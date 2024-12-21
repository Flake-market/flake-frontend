"use client"
import Image from "next/image";

import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
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

// Mock data for requests
interface Request {
  txnHash: string;
  amount: string;
  status: "Pending" | "Completed" | "Rejected";
  age: string;
}

const mockRequests: Request[] = [
  {
    txnHash: "ABCD1234EFGH5678IJKL",
    amount: "1000 VTL",
    status: "Pending",
    age: "10 minutes",
  },
  {
    txnHash: "MNOP1234QRST5678UVWX",
    amount: "2000 VTL",
    status: "Pending",
    age: "1 hour",
  },
];

export default function Manage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");

  useEffect(() => {
    // Fetch requests data from backend or blockchain
    setRequests(mockRequests);
  }, []);

  const filteredRequests = requests.filter(request => {
    if (statusFilter === "all") return true;
    if (statusFilter === "pending") return request.status === "Pending";
    return request.status === "Completed";
  });

  return (
    <RequireWallet>
      <div className="container mx-auto mt-10">
        <div className="mb-8">
          <h1 className="text-2xl mb-4 flex items-center gap-2">
            Total Earnings:{" "}
            <Image
              src="/images/tokens/solana.svg"
              alt="SOL"
              width={20}
              height={20}
            />
            10 <div className="flex items-center gap-1">SOL</div>
          </h1>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground">Trading Fee: 4 SOL</p>
              <p className="text-muted-foreground">Request Fee: 6 SOL</p>
            </div>
          </div>
          <button className="bg-grey-500 text-white px-8 py-2 rounded-md mt-4 hover:bg-grey-600 transition-colors w-fit">
            Claim
          </button>
        </div>
        <Separator />
        <div>
          <div className="flex justify-between items-center mt-6 mb-4">
            <h1 className="text-2xl flex items-center gap-2">
              Manage Requests
            </h1>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <p className="text-muted-foreground">
              Pending Requests: {requests.filter(r => r.status === "Pending").length}
            </p>
            <p className="text-muted-foreground">
              Total Amount: {filteredRequests
                .filter(r => r.status === "Pending")
                .reduce((acc, r) => acc + parseInt(r.amount.split(" ")[0]), 0)} VTL
            </p>
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
                <TableHead className="w-1/6">AMOUNT</TableHead>
                <TableHead className="w-1/6">STATUS</TableHead>
                <TableHead className="w-1/6">AGE</TableHead>
                <TableHead className="w-1/12">ACCEPT</TableHead>
                <TableHead className="w-1/12">REJECT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell className="pl-7">
                      <a
                        href={`https://solscan.io/tx/${request.txnHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-grey-500 hover:underline"
                      >
                        {`${request.txnHash.slice(0, 6)}...${request.txnHash.slice(-4)}`}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>{request.amount}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>{request.age}</TableCell>
                    <TableCell>
                      <button className="border-2 border-grey-500 text-grey-500 px-4 py-1.5 rounded-md hover:bg-grey-500 hover:text-white transition-colors w-36">
                        Accept
                      </button>
                    </TableCell>
                    <TableCell>
                      <button className="border-2 border-red-500 text-red-500 px-4 py-1.5 rounded-md hover:bg-red-500 hover:text-white transition-colors w-36">
                        Reject
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