/**
 * Contracts between Gateway ↔ Escrow Service
 */

export interface CreateEscrowDTO {
  jobId: string;
  clientId: string;
  freelancerId: string;
  totalAmount: number;
}

export interface EscrowResponseDTO {
  id: string;
  jobId: string;
  clientId: string;
  freelancerId: string;
  totalAmount: number;
  status: string;
}
