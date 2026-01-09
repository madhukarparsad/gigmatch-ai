import { Kafka } from "kafkajs";
import { db } from "@gigmatch/db";
import { auditLogs } from "@gigmatch/db/src/schema/audit_logs";

const kafka = new Kafka({
  clientId: "gigmatch-audit",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "audit-log-group"
});

export async function initAuditConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "audit.event",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());

      await db.insert(auditLogs).values({
        actorId: event.actorId,
        action: event.action,
        entityType: event.entityType,
        entityId: event.entityId,
        metadata: event.metadata
      });
    }
  });
}
