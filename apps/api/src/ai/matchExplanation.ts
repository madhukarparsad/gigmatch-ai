export function buildMatchExplanation(input: {
  reputation: number;
  bidAmount: number;
  skillMatchScore: number;
}) {
  return {
    reputationImpact: input.reputation * 0.4,
    skillImpact: input.skillMatchScore * 40,
    priceImpact: (1 / input.bidAmount) * 200,
    summary: [
      input.skillMatchScore > 0.7
        ? "Strong skill match"
        : "Partial skill match",
      input.reputation > 50
        ? "Good reputation"
        : "New or low reputation",
      "Competitive bid price"
    ]
  };
}
