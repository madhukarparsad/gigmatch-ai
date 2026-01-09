/**
 * Simple weighted ranking
 * (baseline before ML models)
 */

export function rankFreelancers(input: {
  reputation: number;
  bidAmount: number;
  skillMatchScore: number; // 0–1
}) {
  const {
    reputation,
    bidAmount,
    skillMatchScore
  } = input;

  return (
    reputation * 0.4 +
    skillMatchScore * 100 * 0.4 +
    (1 / bidAmount) * 1000 * 0.2
  );
}
