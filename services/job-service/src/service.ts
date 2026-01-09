import { db } from "@gigmatch/db";
import { jobs } from "@gigmatch/db/src/schema/jobs";

export async function createJob(input: {
  clientId: string;
  title: string;
  description: string;
}) {
  const [job] = await db
    .insert(jobs)
    .values(input)
    .returning();

  return job;
}

export async function listJobs() {
  return db.select().from(jobs);
}
