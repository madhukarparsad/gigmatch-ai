import { Kafka } from "kafkajs";
import { sendNotification } from "@gigmatch/utils/src/notification";

const kafka = new Kafka({
  clientId: "gigmatch-payment-notify",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "payment-notification-group"
});

export async function initPaymentNotificationConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "payment.completed",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());

      const { milestoneId, amount } = event;

      // 🔔 Notify freelancer (userId resolved earlier in pipeline)
      await sendNotification({
        userId: event.freelancerId,
        type: "payment.success",
        payload: {
          milestoneId,
          amount
        }
      });
    }
  });
}
