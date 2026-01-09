/**
 * Milestones belong to an escrow
 */

export interface CreateMilestoneDTO {
  escrowId: string;
  title: string;
  amount: number;
}

export interface MilestoneResponseDTO {
  id: string;
  escrowId: string;
  title: string;
  amount: number;
  status: "pending" | "released";
}
