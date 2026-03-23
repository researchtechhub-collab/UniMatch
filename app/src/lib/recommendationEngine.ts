import { dhakaAreas, priorityOptions, type DepartmentProgram, type Recommendation, type StudentProfile, type University } from '@/types';
import { programs, universities } from '@/data/universities';

const budgetCeilings: Record<string, number> = {
  '200,000–300,000 BDT': 300000,
  '300,000–400,000 BDT': 400000,
  '400,000–500,000 BDT': 500000,
  '500,000–600,000 BDT': 600000,
  '600,000–700,000 BDT': 700000,
  '700,000–800,000 BDT': 800000,
  '800,000–900,000 BDT': 900000,
  '900,000–1,000,000 BDT': 1000000,
  '1,000,000–1,200,000 BDT': 1200000,
  'No Budget Constraint': Number.POSITIVE_INFINITY,
};

const priorityWeightByRank = [1.35, 1.2, 1.05, 0.95, 0.85] as const;

const areaMap = new Map(dhakaAreas.map((area) => [area.id, area]));
const priorityIndex = new Map(priorityOptions.map((option) => [option.id, option.label]));

function getBudgetScore(profile: StudentProfile, program: DepartmentProgram): number {
  const ceiling = budgetCeilings[profile.budgetRange] ?? Number.POSITIVE_INFINITY;
  if (!Number.isFinite(ceiling)) return 78;
  const ratio = program.totalCost / ceiling;
  if (ratio <= 0.72) return 96;
  if (ratio <= 0.85) return 88;
  if (ratio <= 1) return 76;
  if (ratio <= 1.12) return 58;
  if (ratio <= 1.25) return 40;
  return 18;
}

function getGpaScore(profile: StudentProfile, program: DepartmentProgram): number {
  const margin = profile.hscGpa - program.minimumGpa;
  if (margin >= 1) return 100;
  if (margin >= 0.6) return 92;
  if (margin >= 0.3) return 84;
  if (margin >= 0) return 78;
  if (margin >= -0.2) return 62;
  if (margin >= -0.4) return 45;
  return 22;
}

function getQualityScore(university: University): number {
  const base = university.ugcStatus === 'approved' ? 72 : 42;
  const rankingBoost = Math.max(0, 24 - university.ranking * 1.6);
  return Math.min(100, Math.round(base + rankingBoost));
}

function getReputationScore(university: University): number {
  const ageBoost = Math.min(12, new Date().getFullYear() - university.establishedYear);
  return Math.min(100, Math.round(70 + ageBoost - university.ranking * 1.4));
}

function getFacilitiesScore(university: University): number {
  return Math.min(100, 68 + university.facilities.length * 5);
}

function getAreaScore(profile: StudentProfile, university: University): number {
  if (profile.preferredAreas.length === 0) return 70;
  return profile.preferredAreas.includes(university.areaId) ? 98 : 48;
}

function estimateWaiver(profile: StudentProfile, university: University): string {
  const combined = profile.hscGpa + profile.sscGpa;
  const band = university.scholarshipPolicies.find((policy) => combined >= policy.minCombinedGpa);
  return band ? `${band.waiver} likely · ${band.note}` : 'Waiver depends on admission performance and current circular.';
}

function priorityAdjustedScore(profile: StudentProfile, university: University, program: DepartmentProgram): number {
  const rawScores = {
    affordability: getBudgetScore(profile, program),
    gpa: getGpaScore(profile, program),
    quality: getQualityScore(university),
    reputation: getReputationScore(university),
    facilities: getFacilitiesScore(university),
  };

  const ordered: Array<keyof typeof rawScores> = profile.orderedPriorities.length > 0
    ? [...profile.orderedPriorities]
    : ['quality', 'affordability', 'gpa', 'reputation', 'facilities'];

  let weightedTotal = 0;
  let weightSum = 0;
  ordered.forEach((key, index) => {
    const weight = priorityWeightByRank[index] ?? 0.8;
    weightedTotal += rawScores[key] * weight;
    weightSum += weight;
  });

  const areaScore = getAreaScore(profile, university);
  const baseline = weightedTotal / weightSum;
  const finalScore = baseline * 0.88 + areaScore * 0.12;
  return Math.max(0, Math.min(100, Math.round(finalScore)));
}

function buildReasons(profile: StudentProfile, university: University, program: DepartmentProgram): string[] {
  const reasons = [
    `${university.name} is ${university.ugcStatus === 'approved' ? 'UGC approved' : 'listed with a caution notice'}, and UGC status is always prioritized first.`,
    `${program.name} requires a minimum GPA of ${program.minimumGpa.toFixed(1)}, while your HSC GPA is ${profile.hscGpa.toFixed(2)}.`,
    `Estimated total cost is ৳${program.totalCost.toLocaleString()}, aligned against your selected budget: ${profile.budgetRange}.`,
  ];

  const area = areaMap.get(university.areaId);
  if (area) reasons.push(`Campus area: ${area.label} (${area.livingCost}).`);
  if (profile.orderedPriorities.length > 0) {
    reasons.push(`Your priorities favor ${profile.orderedPriorities.map((item) => priorityIndex.get(item) ?? item).join(', ')}.`);
  }

  return reasons;
}

export function getProgramsForUniversity(universityId: string): DepartmentProgram[] {
  return programs
    .filter((program) => program.universityId === universityId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function generateRecommendations(profile: StudentProfile, limit = 12): Recommendation[] {
  const relevantPrograms = programs.filter((program) => profile.academicInterests.length === 0 || profile.academicInterests.includes(program.categoryId));

  const recs = relevantPrograms
    .map((program) => {
      const university = universities.find((item) => item.id === program.universityId);
      if (!university) return null;
      return {
        university,
        program,
        score: priorityAdjustedScore(profile, university, program),
        waiverEstimate: estimateWaiver(profile, university),
        reasons: buildReasons(profile, university, program),
      } satisfies Recommendation;
    })
    .filter((item): item is Recommendation => Boolean(item));

  return recs
    .sort((a, b) => {
      if (a.university.ugcStatus !== b.university.ugcStatus) {
        return a.university.ugcStatus === 'approved' ? -1 : 1;
      }
      if (b.score !== a.score) return b.score - a.score;
      return a.university.ranking - b.university.ranking;
    })
    .slice(0, limit);
}
