import { Router } from "express";
import { createJob, listJobs } from "./service";

export const jobRoutes = Router();

// Create job
jobRoutes.post("/", async (req, res) => {
  const job = await createJob(req.body);
  res.json(job);
});

// List jobs
jobRoutes.get("/", async (_req, res) => {
  const jobs = await listJobs();
  res.json(jobs);
});
