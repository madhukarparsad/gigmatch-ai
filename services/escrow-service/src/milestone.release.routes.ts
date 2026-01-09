import { Router } from "express";
import { releaseMilestone } from "./milestone.release.service";

export const milestoneReleaseRoutes = Router();

milestoneReleaseRoutes.post("/:milestoneId/release", async (req, res) => {
  // actorId passed from Gateway via header (internal trust)
  const actorId = req.headers["x-actor-id"] as string;

  const milestone = await releaseMilestone(
    req.params.milestoneId,
    actorId
  );

  res.json(milestone);
});
