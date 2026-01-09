import { Kafka } from "kafkajs";
import { io } from "../index";

const kafka = new Kafka({
  clientId: "gigmatch-realtime",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "realtime-bid-group"
});

export async function initBidConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "bid.placed",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());

      const { clientId, jobId, amount } = event;

      // 🔔 notify client in realtime
      io.to(clientId).emit("bid:placed", {
        jobId,
        amount,
        message: "New bid received"
      });
    }
  });
}
