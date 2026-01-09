import { Kafka } from "kafkajs";
import { db } from "@gigmatch/db";
import { notifications } from "@gigmatch/db/src/schema/notifications";

const kafka = new Kafka({
  clientId: "gigmatch-worker",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "notification-persist-group"
});

export async function initNotificationPersistConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "notification.created",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());
      const { userId, type, payload } = event;

      await db.insert(notifications).values({
        userId,
        type,
        payload
      });
    }
  });
}
