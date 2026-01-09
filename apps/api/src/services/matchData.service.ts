import { listBids } from "../clients/bidService.client";
import { getReputationScore } from "./reputationRead.service";

/**
 * Collect signals needed for ranking
 */
export async function getMatchSignals(jobId: string) {
  const bids = await listBids(jobId);

  return Promise.all(
    bids.map(async (bid: any) => {
      const reputation = await getReputationScore(bid.freelancerId);

      return {
        freelancerId: bid.freelancerId,
        bidAmount: bid.amount,
        reputation: reputation.score
      };
    })
  );
}
