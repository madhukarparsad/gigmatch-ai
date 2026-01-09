import { Kafka } from "kafkajs";
import { db } from "@gigmatch/db";
import { savedSearches } from "@gigmatch/db/src/schema/saved_searches";
import { sql } from "drizzle-orm";
import { sendNotification } from "@gigmatch/utils/src/notification";

const kafka = new Kafka({
  clientId: "gigmatch-alerts",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "search-alert-group"
});

export async function initSearchAlertConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "job.created",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const job = JSON.parse(message.value.toString());
      const text = `${job.title} ${job.description}`;

      // 🔍 Find matching saved searches
      const matches = await db.execute(sql`
        SELECT user_id
        FROM saved_searches
        WHERE to_tsvector('english', ${text})
        @@ plainto_tsquery('english', query)
      `);

      // 🔔 Trigger notification (stub)
      for (const row of matches.rows) {
        console.log(
          `🔔 Alert user ${row.user_id} for new job ${job.id}`
        );
        await sendNotification({
          userId: row.user_id,
          type: "job.alert",
          payload: {
          jobId: job.id,
          title: job.title
          }
        });
        // later: emit Kafka / Socket / Email
      }
    }
  });
}
