export interface PlaceBidDTO {
  jobId: string;
  freelancerId: string;
  amount: number;
}

export interface BidResponseDTO {
  id: string;
  jobId: string;
  freelancerId: string;
  amount: number;
  createdAt: string;
}
