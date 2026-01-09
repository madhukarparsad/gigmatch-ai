import express from "express";
import dotenv from "dotenv";
import { escrowRoutes } from "./routes";
import { verifyInternalAuth } from "./internalAuth";
import { milestoneRoutes } from "./milestone.routes";
import { milestoneReleaseRoutes } from "./milestone.release.routes";



dotenv.config();

const app = express();
app.use(express.json());

// 🔐 internal trust
app.use(verifyInternalAuth);

app.use("/milestones", milestoneReleaseRoutes);
app.use("/milestones", milestoneRoutes);
app.use("/escrows", escrowRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`💰 Escrow Service running on port ${PORT}`);
});
