import { Router } from "express";
import { createEscrow, getEscrowByJob } from "./service";
import { CreateEscrowDTO } from "./dto";

export const escrowRoutes = Router();

escrowRoutes.post("/", async (req, res) => {
  const escrow = await createEscrow(req.body as CreateEscrowDTO);
  res.json(escrow);
});

escrowRoutes.get("/:jobId", async (req, res) => {
  const escrows = await getEscrowByJob(req.params.jobId);
  res.json(escrows);
});
