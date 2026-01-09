import { Kafka } from "kafkajs";
import { io } from "../index";

const kafka = new Kafka({
  clientId: "gigmatch-realtime",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "realtime-notification-group"
});

export async function initNotificationConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "notification.created",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());

      const { userId, type, payload, createdAt } = event;

      // 🔔 Realtime delivery
      io.to(userId).emit("notification", {
        type,
        payload,
        createdAt
      });
    }
  });
}
