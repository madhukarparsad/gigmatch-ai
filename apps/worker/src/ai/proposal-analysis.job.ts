// @ts-ignore: module has no type declarations or is not installed with types
import { pipeline } from "@xenova/transformers";
import { Kafka } from "kafkajs";
import { mongo } from "@gigmatch/db/src/mongo/client";

const kafka = new Kafka({
  clientId: "gigmatch-ai",
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({
  groupId: "ai-proposal-analysis"
});

export async function initProposalAnalysisJob() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "bid.placed",
    fromBeginning: false
  });

  // Load once (important)
  const sentiment = await pipeline(
    "sentiment-analysis",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
  );

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const event = JSON.parse(message.value.toString());
      const { bidId, freelancerId, proposal } = event;

      // 🧠 NLP inference
      const result = await sentiment(proposal);

      // 📊 Simple quality score (can evolve later)
      const score =
        result[0].label === "POSITIVE"
          ? Math.round(result[0].score * 100)
          : Math.round((1 - result[0].score) * 50);

      // 🍃 Store AI insight in Mongo
      await mongo.collection("ai_insights").insertOne({
        type: "proposal",
        bidId,
        userId: freelancerId,
        sentiment: result[0].label,
        score,
        createdAt: new Date()
      });
    }
  });
}
