import "dotenv/config";
import express from "express";
import { authMiddleware } from "./middleware/auth";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql/schema";
import { rateLimit } from "./middleware/rateLimit";


const app = express();
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "api-gateway-ok" });
});

app.use(rateLimit);

// 🔐 Protected GraphQL
app.use(
  "/graphql",
  authMiddleware,
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(4000, () => {
  console.log("🚪 API Gateway running on :4000");
});
