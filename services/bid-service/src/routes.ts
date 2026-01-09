import { Router } from "express";
import { placeBid, listBids } from "./service";
import { PlaceBidDTO } from "./dto";

export const bidRoutes = Router();

bidRoutes.post("/", async (req, res) => {
  const bid = await placeBid(req.body as PlaceBidDTO);
  res.json(bid);
});

bidRoutes.get("/:jobId", async (req, res) => {
  const bids = await listBids(req.params.jobId);
  res.json(bids);
});
