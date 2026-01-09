import * as express from "express";
import * as dotenv from "dotenv";
import { bidRoutes } from "./routes";
import { verifyInternalAuth } from "./internalAuth";

dotenv.config();

const app = express();
app.use(express.json());

app.use(verifyInternalAuth);

app.use("/bids", bidRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(` Bid Service running on port ${PORT}`);
});
