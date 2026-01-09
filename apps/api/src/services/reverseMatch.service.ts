import { listJobs } from "../clients/jobService.client";
import { getReputationScore } from "./reputationRead.service";
import { computeSkillMatchScore } from "../ai/skillMatcher";
import { rankFreelancers } from "../ai/matchRanker";

/**
 * Recommend jobs for a freelancer
 */
export async function getRecommendedJobs(
  freelancerId: string,
  freelancerSkills: string[]
) {
  const jobs = await listJobs();
  const reputation = await getReputationScore(freelancerId);

  return jobs.map(job => {
    const skillScore = computeSkillMatchScore(
      job.skills,
      freelancerSkills
    );

    const score = rankFreelancers({
      reputation,
      bidAmount: job.avgBid ?? 500, // heuristic
      skillMatchScore: skillScore
    });

    return {
      jobId: job.id,
      title: job.title,
      score
    };
  }).sort((a, b) => b.score - a.score);
}
