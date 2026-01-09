export interface AIInsight {
  userId: string;
  jobId?: string;

  type: "proposal" | "portfolio" | "reputation";

  summary: string;
  score: number;

  suggestions: string[];

  createdAt: Date;
}
