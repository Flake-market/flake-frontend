export interface Request {
  pairKey: string;
  user: string;
  creator: string;
  requestIndex: number;
  adText: string;
  createdAt: string;
  status: "Pending" | "Accepted" | "Rejected";
  updatedAt: string;
}

export interface RequestResponse {
  requests: Request[];
} 