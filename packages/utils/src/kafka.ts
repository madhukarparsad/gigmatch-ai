import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "gigmatch",
  brokers: [process.env.KAFKA_BROKER!]
});

export const producer = kafka.producer();

export async function emitEvent(topic: string, payload: any) {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(payload) }]
  });
}
