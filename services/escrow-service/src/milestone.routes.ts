import { Router } from "express";
import { createMilestone, listMilestones } from "./milestone.service";
import { CreateMilestoneDTO } from "./milestone.dto";

export const milestoneRoutes = Router();

milestoneRoutes.post("/", async (req, res) => {
  const milestone = await createMilestone(req.body as CreateMilestoneDTO);
  res.json(milestone);
});

milestoneRoutes.get("/:escrowId", async (req, res) => {
  const milestones = await listMilestones(req.params.escrowId);
  res.json(milestones);
});
