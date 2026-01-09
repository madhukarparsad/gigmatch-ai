import axios from "axios";

const BID_SERVICE_URL = process.env.BID_SERVICE_URL!;
const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN!;

export async function placeBid(input: {
  jobId: string;
  freelancerId: string;
  amount: number;
}) {
  const res = await axios.post(
    `${BID_SERVICE_URL}/bids`,
    input,
    {
      headers: {
        "x-internal-token": INTERNAL_TOKEN
      }
    }
  );
  return res.data;
}

export async function listBids(jobId: string) {
  const res = await axios.get(
    `${BID_SERVICE_URL}/bids/${jobId}`,
    {
      headers: {
        "x-internal-token": INTERNAL_TOKEN
      }
    }
  );
  return res.data;
}
