import { db } from "@gigmatch/db";
import { bids } from "@gigmatch/db/src/schema/bids";
import { eq } from "drizzle-orm";
import { PlaceBidDTO } from "./dto";


export async function placeBid(input: PlaceBidDTO) {
  const [bid] = await db
    .insert(bids)
    .values({
      jobId: input.jobId,
      freelancerId: input.freelancerId,
      amount: input.amount,
      proposal: (input as any).proposal ?? ""
    })
    .returning();

  return bid;
}

/**
 * List bids for a job
 */
export async function listBids(jobId: string) {
  return db
    .select()
    .from(bids)
    .where(eq(bids.jobId, jobId));
}
