export function computeSkillMatchScore(
  requiredSkills: string[],
  freelancerSkills: string[]
): number  {
  // Return a fraction between 0 and 1 representing how many required skills
  // the freelancer has (case-insensitive). If no required skills are specified,
  // consider it a full match.
  if (!requiredSkills || requiredSkills.length === 0) return 1;

  const reqSet = new Set(
    requiredSkills.map((s) => s.trim().toLowerCase()).filter(Boolean)
  );
  const freeSet = new Set(
    (freelancerSkills || []).map((s) => s.trim().toLowerCase()).filter(Boolean)
  );

  let matchCount = 0;
  for (const skill of reqSet) {
    if (freeSet.has(skill)) matchCount++;
  }

  return matchCount / reqSet.size;
}
