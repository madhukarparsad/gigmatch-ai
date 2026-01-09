import { Kafka } from "kafkajs";
import { db } from "@gigmatch/db";
import { payments } from "@gigmatch/db/src/schema/payments";
import { eq } from "drizzle-orm";
import { emitEvent } from "@gigmatch/utils/src/kafka";



const kafka = new Kafka({
  clientId: "gigmatch-payment",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "payment-group"
});

export async function initPaymentConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "milestone.released",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());

      const {
        milestoneId,
        escrowId,
        amount
      } = event;

      // 🛑 Idempotency check
      const existing = await db
        .select()
        .from(payments)
        .where(payments.milestoneId.eq(milestoneId));

      if (existing.length > 0) {
        return;
      }

      // 💸 Simulated payout
      await db.insert(payments).values({
        milestoneId,
        escrowId,
        amount,
        status: "completed"
      });

      // after inserting payment
await emitEvent("payment.completed", {
  milestoneId,
  escrowId,
  amount
});
    }
    
  });
}
