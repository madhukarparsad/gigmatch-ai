import { db } from "@gigmatch/db";
import { escrows } from "@gigmatch/db";
import { eq } from "drizzle-orm";
import { CreateEscrowDTO } from "./dto";

export async function createEscrow(input: CreateEscrowDTO) {
  const [escrow] = await db
    .insert(escrows)
    .values({
      jobId: input.jobId,
      clientId: input.clientId,
      freelancerId: input.freelancerId,
      totalAmount: input.totalAmount,
      status: "active"
    })
    .returning();

  return escrow;
}
export async function getEscrowByJob(jobId: string) {
  return db.select().from(escrows).where(eq(escrows.jobId, jobId));
}

