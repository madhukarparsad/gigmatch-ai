import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URL!);

export const mongo = client.db("gigmatch");
