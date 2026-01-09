import { db } from "@gigmatch/db";
import { reputation } from "@gigmatch/db/src/schema/reputation";
import { eq } from "drizzle-orm";

/**
 * Read-only reputation fetch
 * (No service boundary violation)
 */
export async function getReputationScore(userId: string) {
  const result = await db
    .select()
    .from(reputation)
    .where(eq(reputation.userId, userId));

  if (result.length === 0) {
    return 0;
  }

  return result[0].score;
}
