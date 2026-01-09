import axios from "axios";

const JOB_SERVICE_URL = process.env.JOB_SERVICE_URL!;
const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN!;

export async function createJob(input: any) {
  const res = await axios.post(
    `${JOB_SERVICE_URL}/jobs`,
    input,
    {
      headers: {
        "x-internal-token": INTERNAL_TOKEN
      }
    }
  );
  return res.data;
}

export async function listJobs() {
  const res = await axios.get(
    `${JOB_SERVICE_URL}/jobs`,
    {
      headers: {
        "x-internal-token": INTERNAL_TOKEN
      }
    }
  );
  return res.data;
}
