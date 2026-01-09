import { Kafka } from "kafkajs";
import { db } from "@gigmatch/db";
import { reputation } from "@gigmatch/db/src/schema/reputation";
import { eq, sql } from "drizzle-orm";

const kafka = new Kafka({
  clientId: "gigmatch-worker",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "reputation-update-group"
});

export async function initReputationConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "escrow.completed",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());
      const { freelancerId, clientId } = event;

      // Freelancer reputation ↑
      await db
        .insert(reputation)
        .values({
          userId: freelancerId,
          completedJobs: 1
        })
        .onConflictDoUpdate({
          target: reputation.userId,
          set: {
            completedJobs: sql`${reputation.completedJobs} + 1`,
            score: sql`${reputation.score} + 5`,
            updatedAt: new Date()
          }
        });

      // Client reputation ↑
      await db
        .insert(reputation)
        .values({
          userId: clientId,
          completedJobs: 1
        })
        .onConflictDoUpdate({
          target: reputation.userId,
          set: {
            completedJobs: sql`${reputation.completedJobs} + 1`,
            score: sql`${reputation.score} + 2`,
            updatedAt: new Date()
          }
        });
    }
  });
}
