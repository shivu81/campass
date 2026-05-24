import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const careers = require("./data/careers.json");

const WEIGHTS = {
  interests: 0.3,
  skills: 0.4,
  personality: 0.3
};

const SKILL_NAMES = ["Coding", "Communication", "Design", "Analysis", "Writing"];

function normalizeList(value = []) {
  return value.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
}

function calculateInterestScore(userInterests, careerInterests) {
  const selected = normalizeList(userInterests);
  const required = normalizeList(careerInterests);

  if (!selected.length || !required.length) return 0;

  const matches = selected.filter((interest) => required.includes(interest)).length;
  return matches / required.length;
}

function calculateSkillScore(userSkills = {}, careerSkills = {}) {
  const ratios = SKILL_NAMES.map((skill) => {
    const userLevel = Number(userSkills[skill] || 0);
    const requiredLevel = Number(careerSkills[skill] || 1);
    return Math.min(userLevel / requiredLevel, 1);
  });

  return ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
}

function calculatePersonalityScore(userPersonality = [], careerPersonality = []) {
  const selected = normalizeList(userPersonality);
  const required = normalizeList(careerPersonality);

  if (!selected.length || !required.length) return 0;

  const matches = required.filter((trait) => selected.includes(trait)).length;
  return matches / required.length;
}

function getMissingSkills(userSkills = {}, careerSkills = {}) {
  return Object.entries(careerSkills)
    .filter(([skill, required]) => Number(userSkills[skill] || 0) < Number(required))
    .sort((a, b) => b[1] - a[1])
    .map(([skill, required]) => ({
      skill,
      current: Number(userSkills[skill] || 0),
      target: Number(required)
    }));
}

function createExplanation({ career, interestScore, skillScore, personalityScore, userProfile }) {
  const matchingInterests = career.interests.filter((interest) =>
    userProfile.interests.includes(interest)
  );
  const matchingTraits = career.personality.filter((trait) =>
    userProfile.personality.includes(trait)
  );

  const interestText = matchingInterests.length
    ? `your interest in ${matchingInterests.join(", ")}`
    : "your broader exploration pattern";
  const traitText = matchingTraits.length
    ? `your ${matchingTraits.join(", ")} style`
    : "your personality balance";

  const skillPercent = Math.round(skillScore * 100);
  const personalityPercent = Math.round(personalityScore * 100);
  const interestPercent = Math.round(interestScore * 100);

  return `This path fits ${interestText}, ${traitText}, and your current skill readiness. The match combines ${interestPercent}% interest alignment, ${skillPercent}% skill alignment, and ${personalityPercent}% personality alignment.`;
}

export function recommendCareers(userProfile) {
  const normalizedProfile = {
    interests: userProfile.interests || [],
    skills: userProfile.skills || {},
    personality: userProfile.personality || []
  };

  return careers
    .map((career) => {
      const interestScore = calculateInterestScore(normalizedProfile.interests, career.interests);
      const skillScore = calculateSkillScore(normalizedProfile.skills, career.skills);
      const personalityScore = calculatePersonalityScore(
        normalizedProfile.personality,
        career.personality
      );
      const weightedScore =
        interestScore * WEIGHTS.interests +
        skillScore * WEIGHTS.skills +
        personalityScore * WEIGHTS.personality;

      return {
        id: career.id,
        careerName: career.name,
        score: Math.round(weightedScore * 100),
        description: career.description,
        why: createExplanation({
          career,
          interestScore,
          skillScore,
          personalityScore,
          userProfile: normalizedProfile
        }),
        requiredSkillsToImprove: getMissingSkills(normalizedProfile.skills, career.skills),
        futureScope: career.growth,
        breakdown: {
          interests: Math.round(interestScore * 100),
          skills: Math.round(skillScore * 100),
          personality: Math.round(personalityScore * 100)
        }
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export { careers, WEIGHTS };
