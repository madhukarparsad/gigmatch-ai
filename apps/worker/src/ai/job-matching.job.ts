import { Kafka } from "kafkajs";
import { mongo } from "@gigmatch/db/src/mongo/client";

/**
 * Very first version:
 * - skill overlap
 * - reputation boost
 * - proposal score (later)
 * This is intentionally simple & evolvable.
 */

const kafka = new Kafka({
  clientId: "gigmatch-ai",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "ai-job-matching-group"
});

export async function initJobMatchingJob() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "job.created",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());
      const { jobId, skillsRequired } = event;

      // 🍃 fetch freelancers
      const freelancers = await mongo
        .collection("profiles")
        .find({ role: "freelancer" })
        .toArray();

      const matches = freelancers.map((freelancer: any) => {
        const skillOverlap =
          freelancer.skills?.filter((s: string) =>
            skillsRequired.includes(s)
          ).length || 0;

        const score =
          skillOverlap * 10 +
          (freelancer.reputationScore || 50) * 0.2;

        return {
          jobId,
          freelancerId: freelancer.userId,
          score
        };
      });

      // 🔽 sort best → worst
      matches.sort((a, b) => b.score - a.score);

      // 🍃 store results
      await mongo.collection("job_matches").insertOne({
        jobId,
        generatedAt: new Date(),
        matches: matches.slice(0, 20) // top 20
      });
    }
  });
}
