import * as express from "express";
import * as dotenv from "dotenv";
import { jobRoutes } from "./routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/jobs", jobRoutes);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(` Job Service running on port ${PORT}`);
});
