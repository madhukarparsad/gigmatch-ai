import { Kafka } from "kafkajs";
import { io } from "../index";

const kafka = new Kafka({
  clientId: "gigmatch-realtime",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "realtime-milestone-group"
});

export async function initMilestoneConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "milestone.released",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());

      const { escrowId, milestoneId, amount } = event;

      // 🔔 Notify both sides
      io.to(event.clientId).emit("milestone:released", {
        escrowId,
        milestoneId,
        amount,
        message: "Milestone released successfully"
      });

      io.to(event.freelancerId).emit("payment:released", {
        escrowId,
        milestoneId,
        amount,
        message: "Payment released for milestone"
      });
    }
  });
}
