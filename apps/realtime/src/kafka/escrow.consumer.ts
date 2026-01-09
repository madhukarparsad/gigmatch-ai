import { Kafka } from "kafkajs";
import { io } from "../index";

const kafka = new Kafka({
  clientId: "gigmatch-realtime",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "realtime-escrow-group"
});

export async function initKafkaConsumers() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "escrow.created",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());

      const { clientId, freelancerId, amount } = event;

      // 🔔 notify client
      io.to(clientId).emit("escrow:created", {
        message: "Escrow created successfully",
        amount
      });

      // 🔔 notify freelancer
      io.to(freelancerId).emit("hired", {
        message: "You have been hired!",
        amount
      });
    }
  });
}
