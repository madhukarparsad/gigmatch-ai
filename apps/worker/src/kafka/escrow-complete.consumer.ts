import { Kafka } from "kafkajs";
import { db } from "@gigmatch/db";
import { escrows } from "@gigmatch/db/src/schema/escrow";
import { eq } from "drizzle-orm";

const kafka = new Kafka({
  clientId: "gigmatch-worker",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "escrow-complete-group"
});

export async function initEscrowCompletionConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "milestone.released",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());
      const { escrowId } = event;

      // 1️⃣ Fetch escrow
      const [escrow] = await db
        .select()
        .from(escrows)
        .where(eq(escrows.id, escrowId));

      if (!escrow) return;

      // 2️⃣ Auto-complete if fully released
      if (escrow.releasedAmount >= escrow.totalAmount) {
        await db
          .update(escrows)
          .set({ status: "completed" })
          .where(eq(escrows.id, escrow.id));

        console.log(`✅ Escrow ${escrow.id} auto-completed`);
      }
    }
  });
}
