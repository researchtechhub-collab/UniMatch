// AI Recommendation Engine for UniMatch Bangladesh
// Calculates match scores and generates explanations

import type { 
  StudentProfile, 
  Program, 
  University, 
  Recommendation, 
  MatchScores, 
  ScoringWeights,
  HSCGroup 
} from '@/types';
import { mockUniversities, mockPrograms } from '@/data/universities';

// Default scoring weights
const DEFAULT_WEIGHTS: ScoringWeights = {
  affordability: 25,
  gpaFit: 20,
  location: 15,
  quality: 20,
  facilities: 10,
  reputation: 10
};

// Get required GPA based on student's HSC group
function getRequiredGPAForGroup(program: Program, group: HSCGroup): number | undefined {
  switch (group) {
    case 'science':
      return program.minGpaScience ?? program.minGpaRequirement;
    case 'commerce':
      return program.minGpaCommerce ?? program.minGpaRequirement;
    case 'arts':
      return program.minGpaArts ?? program.minGpaRequirement;
    default:
      return program.minGpaRequirement;
  }
}

// Calculate affordability score (0-100)
function calculateAffordabilityScore(student: StudentProfile, program: Program): number {
  if (!student.maxBudgetTotal || student.maxBudgetTotal === 999999999) {
    return 70; // Neutral if no budget constraint
  }
  
  const totalCost = program.totalTuitionFee + 
                    (program.admissionFee || 0) + 
                    (program.otherFees || 0);
  
  const ratio = totalCost / student.maxBudgetTotal;
  
  if (ratio <= 0.5) return 100; // Very affordable (50% or less of budget)
  if (ratio <= 0.7) return 90;  // Highly affordable
  if (ratio <= 0.85) return 80; // Affordable
  if (ratio <= 1.0) return 70;  // Within budget
  if (ratio <= 1.15) return 55; // Slightly over
  if (ratio <= 1.3) return 40;  // Moderately over
  if (ratio <= 1.5) return 25;  // Significantly over
  return 10; // Far over budget
}

// Calculate GPA fit score (0-100)
function calculateGPAFitScore(student: StudentProfile, program: Program): number {
  const requiredGPA = getRequiredGPAForGroup(program, student.hscGroup);
  
  if (!requiredGPA) return 80; // No specific requirement
  
  const gpaDifference = student.hscGpa - requiredGPA;
  
  if (gpaDifference >= 1.0) return 100; // Far exceeds requirement
  if (gpaDifference >= 0.75) return 95;
  if (gpaDifference >= 0.5) return 90;  // Comfortably exceeds
  if (gpaDifference >= 0.25) return 85;
  if (gpaDifference >= 0.0) return 80;  // Meets requirement exactly
  if (gpaDifference >= -0.25) return 65; // Just below
  if (gpaDifference >= -0.5) return 50;  // Close but below
  if (gpaDifference >= -0.75) return 35; // Noticeably below
  if (gpaDifference >= -1.0) return 20;  // Significantly below
  return 10; // Far below requirement
}

// Calculate location score (0-100)
function calculateLocationScore(student: StudentProfile, university: University): number {
  // If no preference specified
  if (!student.preferredDistricts || student.preferredDistricts.length === 0) {
    return 70; // Neutral
  }
  
  // Exact district match
  if (student.preferredDistricts.includes(university.district)) {
    return 100;
  }
  
  // Check for nearby districts (simplified - Dhaka area universities)
  const dhakaAreaDistricts = ['Dhaka', 'Gazipur', 'Narayanganj', 'Munshiganj', 'Narsingdi'];
  const studentPrefersDhakaArea = student.preferredDistricts.some(d => dhakaAreaDistricts.includes(d));
  const universityInDhakaArea = dhakaAreaDistricts.includes(university.district);
  
  if (studentPrefersDhakaArea && universityInDhakaArea) {
    return 80; // Same general area
  }
  
  // Different location
  return 40;
}

// Calculate quality score (0-100)
function calculateQualityScore(university: University, _program: Program): number {
  let score = 50; // Base score
  
  // UGC Status factor (highest weight)
  if (university.ugcStatus === 'green') {
    score += 25;
  } else if (university.ugcStatus === 'yellow') {
    score += 10;
  } else {
    score -= 30; // Red status significantly reduces quality
  }
  
  // National ranking factor
  if (university.rankingNational) {
    if (university.rankingNational <= 3) score += 15;
    else if (university.rankingNational <= 5) score += 10;
    else if (university.rankingNational <= 10) score += 5;
    else if (university.rankingNational <= 15) score += 0;
    else score -= 5;
  }
  
  // Permanent campus factor
  if (university.hasPermanentCampus) {
    score += 5;
  }
  
  // Accreditation status
  if (university.accreditationStatus?.toLowerCase().includes('full')) {
    score += 5;
  }
  
  return Math.min(100, Math.max(0, score));
}

// Calculate facilities score (0-100)
function calculateFacilitiesScore(university: University, student: StudentProfile): number {
  let score = 50; // Base score
  
  // Housing facilities
  if (student.requiresHousing) {
    if (university.hasHousingFacilities) {
      score += 25; // Major bonus if housing is available and needed
    } else {
      score -= 20; // Major penalty if housing needed but not available
    }
  } else {
    // If housing not needed, give small bonus for having it anyway
    if (university.hasHousingFacilities) {
      score += 5;
    }
  }
  
  // Permanent campus (indicates better facilities generally)
  if (university.hasPermanentCampus) {
    score += 15;
  }
  
  // Campus size factor
  if (university.campusAreaSqft) {
    if (university.campusAreaSqft >= 500000) score += 10;
    else if (university.campusAreaSqft >= 300000) score += 5;
  }
  
  return Math.min(100, Math.max(0, score));
}

// Calculate reputation score (0-100)
function calculateReputationScore(university: University): number {
  let score = 50; // Base score
  
  // National ranking is the primary factor
  if (university.rankingNational) {
    // Invert ranking (rank 1 = 50 points, rank 20 = 0 points)
    const rankingScore = Math.max(0, 50 - (university.rankingNational - 1) * 2.5);
    score = rankingScore;
  }
  
  // Established year factor (older universities generally more established)
  if (university.establishedYear) {
    const yearsEstablished = new Date().getFullYear() - university.establishedYear;
    if (yearsEstablished >= 30) score += 10;
    else if (yearsEstablished >= 20) score += 5;
    else if (yearsEstablished >= 10) score += 2;
  }
  
  return Math.min(100, Math.max(0, score));
}

// Calculate overall match score
function calculateMatchScore(
  student: StudentProfile,
  program: Program,
  university: University,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): MatchScores {
  const affordabilityScore = calculateAffordabilityScore(student, program);
  const gpaFitScore = calculateGPAFitScore(student, program);
  const locationScore = calculateLocationScore(student, university);
  const qualityScore = calculateQualityScore(university, program);
  const facilitiesScore = calculateFacilitiesScore(university, student);
  const reputationScore = calculateReputationScore(university);
  
  // Calculate weighted average
  const overall = Math.round(
    (affordabilityScore * weights.affordability +
     gpaFitScore * weights.gpaFit +
     locationScore * weights.location +
     qualityScore * weights.quality +
     facilitiesScore * weights.facilities +
     reputationScore * weights.reputation) / 100
  );
  
  return {
    overall: Math.min(100, Math.max(0, overall)),
    affordability: affordabilityScore,
    gpaFit: gpaFitScore,
    location: locationScore,
    quality: qualityScore,
    facilities: facilitiesScore
  };
}

// Generate match explanation
function generateMatchExplanation(
  scores: MatchScores,
  student: StudentProfile,
  program: Program,
  university: University
): string {
  const explanations: string[] = [];
  
  // Affordability explanation
  if (scores.affordability >= 80) {
    explanations.push(`Highly affordable with total fees of ৳${program.totalTuitionFee.toLocaleString()}, well within your budget.`);
  } else if (scores.affordability >= 60) {
    explanations.push(`Fits your budget with total fees of ৳${program.totalTuitionFee.toLocaleString()}.`);
  } else if (scores.affordability >= 40) {
    explanations.push(`Slightly over your stated budget but still manageable.`);
  }
  
  // GPA fit explanation
  const requiredGPA = getRequiredGPAForGroup(program, student.hscGroup);
  if (scores.gpaFit >= 80) {
    explanations.push(`Your GPA of ${student.hscGpa} comfortably meets the requirement${requiredGPA ? ` of ${requiredGPA}` : ''}.`);
  } else if (scores.gpaFit >= 50) {
    explanations.push(`Your GPA is close to the requirement${requiredGPA ? ` of ${requiredGPA}` : ''}.`);
  }
  
  // Location explanation
  if (scores.location >= 80) {
    explanations.push(`Located in ${university.district}, matching your preferred location.`);
  }
  
  // Quality explanation
  if (scores.quality >= 80) {
    explanations.push(`${university.name} has strong academic standing with full UGC accreditation.`);
  }
  
  // Ranking mention for top universities
  if (university.rankingNational && university.rankingNational <= 5) {
    explanations.push(`Ranked #${university.rankingNational} among private universities in Bangladesh.`);
  }
  
  return explanations.join(' ') || 'This program matches your basic requirements.';
}

// Generate pros and cons
function generateProsAndCons(
  scores: MatchScores,
  student: StudentProfile,
  program: Program,
  university: University
): { pros: string[]; cons: string[] } {
  const pros: string[] = [];
  const cons: string[] = [];
  
  // Pros based on scores
  if (scores.affordability >= 80) {
    pros.push('Affordable tuition fees within your budget');
  }
  if (scores.gpaFit >= 80) {
    pros.push('GPA requirements comfortably met');
  }
  if (scores.location >= 80) {
    pros.push('Preferred location - easy commute');
  }
  if (university.hasPermanentCampus) {
    pros.push('Permanent campus with modern facilities');
  }
  if (university.hasHousingFacilities && student.requiresHousing) {
    pros.push('On-campus housing available');
  }
  if (university.ugcStatus === 'green') {
    pros.push('Full UGC compliance - no regulatory concerns');
  }
  if (university.rankingNational && university.rankingNational <= 5) {
    pros.push(`Top-ranked university (#${university.rankingNational})`);
  }
  if (scores.quality >= 80) {
    pros.push('Strong academic reputation and quality');
  }
  
  // Cons based on scores
  if (scores.affordability < 50) {
    cons.push('Tuition fees exceed your stated budget');
  }
  if (scores.gpaFit < 50) {
    const requiredGPA = getRequiredGPAForGroup(program, student.hscGroup);
    cons.push(`Your GPA ${requiredGPA ? `(${student.hscGpa}) is below the typical requirement (${requiredGPA})` : 'may not meet requirements'}`);
  }
  if (!university.hasPermanentCampus) {
    cons.push('No permanent campus (operates from rented facilities)');
  }
  if (university.ugcStatus === 'yellow') {
    cons.push('UGC has issued warnings - verify current status before applying');
  }
  if (scores.location < 50) {
    cons.push('Location may require significant commute');
  }
  if (student.requiresHousing && !university.hasHousingFacilities) {
    cons.push('No on-campus housing available');
  }
  if (university.rankingNational && university.rankingNational > 15) {
    cons.push('Lower national ranking - research program quality carefully');
  }
  
  return { pros, cons };
}

// Generate UGC warning if applicable
function generateUGCWarning(university: University): string | undefined {
  if (university.ugcStatus === 'red') {
    return `WARNING: ${university.name} has been flagged by UGC. We do not recommend applying to this institution. ${university.ugcStatusReason || ''}`;
  }
  
  if (university.ugcStatus === 'yellow') {
    return `NOTICE: ${university.name} has had compliance issues in the past. Please verify current UGC status before applying. ${university.ugcStatusReason || ''}`;
  }
  
  return undefined;
}

// Main recommendation function
export function generateRecommendations(
  student: StudentProfile,
  limit: number = 10
): Recommendation[] {
  const weights: ScoringWeights = {
    affordability: student.weightAffordability ?? DEFAULT_WEIGHTS.affordability,
    gpaFit: student.weightGpaFit ?? DEFAULT_WEIGHTS.gpaFit,
    location: student.weightLocation ?? DEFAULT_WEIGHTS.location,
    quality: student.weightQuality ?? DEFAULT_WEIGHTS.quality,
    facilities: student.weightFacilities ?? DEFAULT_WEIGHTS.facilities,
    reputation: student.weightReputation ?? DEFAULT_WEIGHTS.reputation
  };
  
  const recommendations: Recommendation[] = [];
  
  // Filter programs by faculty preference if specified
  let programsToConsider = mockPrograms;
  if (student.preferredFaculties && student.preferredFaculties.length > 0) {
    programsToConsider = mockPrograms.filter(p => 
      student.preferredFaculties!.includes(p.faculty)
    );
  }
  
  // Generate recommendations for each program
  for (const program of programsToConsider) {
    const university = mockUniversities.find(u => u.id === program.universityId);
    
    if (!university || !university.isActive) continue;
    
    // Skip universities with RED UGC status
    if (university.ugcStatus === 'red') continue;
    
    // Skip if scholarship required but not available (simplified check)
    if (student.requiresScholarship && university.rankingNational && university.rankingNational > 10) {
      // Less likely to have scholarships at lower-ranked universities
      continue;
    }
    
    const scores = calculateMatchScore(student, program, university, weights);
    const { pros, cons } = generateProsAndCons(scores, student, program, university);
    
    const recommendation: Recommendation = {
      program,
      university,
      scores,
      matchExplanation: generateMatchExplanation(scores, student, program, university),
      pros,
      cons,
      ugcWarning: generateUGCWarning(university),
      createdAt: new Date().toISOString()
    };
    
    recommendations.push(recommendation);
  }
  
  // Sort by overall match score (descending)
  recommendations.sort((a, b) => b.scores.overall - a.scores.overall);
  
  // Return top N recommendations
  return recommendations.slice(0, limit);
}

// Filter recommendations by minimum score
export function filterRecommendationsByScore(
  recommendations: Recommendation[],
  minScore: number
): Recommendation[] {
  return recommendations.filter(r => r.scores.overall >= minScore);
}

// Get recommendation statistics
export function getRecommendationStats(recommendations: Recommendation[]) {
  if (recommendations.length === 0) {
    return {
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      totalMatches: 0
    };
  }
  
  const scores = recommendations.map(r => r.scores.overall);
  return {
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    totalMatches: recommendations.length
  };
}

// Export individual scoring functions for testing
export const ScoringFunctions = {
  calculateAffordabilityScore,
  calculateGPAFitScore,
  calculateLocationScore,
  calculateQualityScore,
  calculateFacilitiesScore,
  calculateReputationScore,
  calculateMatchScore
};
