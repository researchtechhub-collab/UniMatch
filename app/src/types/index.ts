// Types for UniMatch Bangladesh - University Recommendation System

// UGC Status Types
export type UGCStatus = 'green' | 'yellow' | 'red';

// HSC Group Types
export type HSCGroup = 'science' | 'commerce' | 'arts' | 'others';

// Faculty Types
export type Faculty = 
  | 'engineering' 
  | 'business' 
  | 'science' 
  | 'arts' 
  | 'social_science' 
  | 'law' 
  | 'medicine' 
  | 'pharmacy' 
  | 'architecture';

// University Interface
export interface University {
  id: string;
  name: string;
  shortName?: string;
  location: string;
  district: string;
  address?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  establishedYear?: number;
  
  // UGC Compliance
  ugcStatus: UGCStatus;
  ugcStatusReason?: string;
  ugcApprovalDate?: string;
  lastUgcCheck?: string;
  
  // Infrastructure
  hasPermanentCampus: boolean;
  campusAreaSqft?: number;
  hasHousingFacilities: boolean;
  housingCapacity?: number;
  
  // Quality Indicators
  accreditationStatus?: string;
  rankingNational?: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Program/Department Interface
export interface Program {
  id: string;
  universityId: string;
  name: string;
  faculty: Faculty;
  degreeType: string; // BSc, BA, BBA, etc.
  durationYears: number;
  
  // Admission Requirements
  minGpaRequirement?: number;
  minGpaScience?: number;
  minGpaCommerce?: number;
  minGpaArts?: number;
  
  // Financial
  totalTuitionFee: number;
  perCreditFee?: number;
  admissionFee?: number;
  semesterFee?: number;
  otherFees?: number;
  
  // Program Details
  totalCredits?: number;
  intakeCapacity?: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Student Profile Interface
export interface StudentProfile {
  id?: string;
  sessionId?: string;
  
  // Academic Background
  hscGpa: number;
  hscGroup: HSCGroup;
  hscPassingYear?: number;
  sscGpa?: number;
  
  // Financial Constraints
  maxBudgetTotal?: number;
  maxBudgetSemester?: number;
  
  // Location Preferences
  preferredDistricts?: string[];
  maxCommuteDistanceKm?: number;
  
  // Housing
  requiresHousing: boolean;
  
  // Academic Interests
  preferredFaculties?: Faculty[];
  preferredPrograms?: string[];
  
  // Scholarship
  requiresScholarship: boolean;
  
  // Weight Preferences (for AI scoring)
  weightAffordability: number;
  weightGpaFit: number;
  weightLocation: number;
  weightQuality: number;
  weightFacilities: number;
  weightReputation: number;
  
  createdAt?: string;
  updatedAt?: string;
}

// Scoring Weights Interface
export interface ScoringWeights {
  affordability: number;
  gpaFit: number;
  location: number;
  quality: number;
  facilities: number;
  reputation: number;
}

// Match Scores Interface
export interface MatchScores {
  overall: number;
  affordability: number;
  gpaFit: number;
  location: number;
  quality: number;
  facilities: number;
}

// Recommendation Interface
export interface Recommendation {
  id?: string;
  studentProfileId?: string;
  program: Program;
  university: University;
  
  // Match Scores
  scores: MatchScores;
  
  // Explanation
  matchExplanation: string;
  pros: string[];
  cons: string[];
  
  // UGC Warning
  ugcWarning?: string;
  
  // Metadata
  createdAt?: string;
  isViewed?: boolean;
  isSaved?: boolean;
}

// UGC Notice Interface
export interface UGCNotice {
  id?: string;
  universityId: string;
  noticeType: 'warning' | 'ban' | 'compliance_issue' | 'other';
  noticeDate: string;
  description: string;
  sourceUrl?: string;
  severity: 'low' | 'medium' | 'high';
  isResolved: boolean;
  resolvedDate?: string;
  createdAt?: string;
}

// Form Step Types
export type FormStep = 
  | 'academic' 
  | 'financial' 
  | 'location' 
  | 'interests' 
  | 'weights' 
  | 'processing' 
  | 'results';

// Districts in Bangladesh
export const BANGLADESH_DISTRICTS = [
  'Bagerhat', 'Bandarban', 'Barguna', 'Barisal', 'Bhola', 'Bogura', 
  'Brahmanbaria', 'Chandpur', 'Chapainawabganj', 'Chattogram', 'Chuadanga', 
  'Coxs Bazar', 'Cumilla', 'Dhaka', 'Dinajpur', 'Faridpur', 'Feni', 
  'Gaibandha', 'Gazipur', 'Gopalganj', 'Habiganj', 'Jamalpur', 'Jashore', 
  'Jhalokati', 'Jhenaidah', 'Joypurhat', 'Khagrachari', 'Khulna', 'Kishoreganj', 
  'Kurigram', 'Kushtia', 'Lakshmipur', 'Lalmonirhat', 'Madaripur', 'Magura', 
  'Manikganj', 'Meherpur', 'Moulvibazar', 'Munshiganj', 'Mymensingh', 'Naogaon', 
  'Narail', 'Narayanganj', 'Narsingdi', 'Natore', 'Netrokona', 'Nilphamari', 
  'Noakhali', 'Pabna', 'Panchagarh', 'Patuakhali', 'Pirojpur', 'Rajbari', 
  'Rajshahi', 'Rangamati', 'Rangpur', 'Satkhira', 'Shariatpur', 'Sherpur', 
  'Sirajganj', 'Sunamganj', 'Sylhet', 'Tangail', 'Thakurgaon'
] as const;

// Faculty Options
export const FACULTY_OPTIONS: { value: Faculty; label: string }[] = [
  { value: 'engineering', label: 'Engineering & Technology' },
  { value: 'business', label: 'Business Administration' },
  { value: 'science', label: 'Science' },
  { value: 'arts', label: 'Arts & Humanities' },
  { value: 'social_science', label: 'Social Science' },
  { value: 'law', label: 'Law' },
  { value: 'medicine', label: 'Medicine & Health Sciences' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'architecture', label: 'Architecture' }
];

// HSC Group Options
export const HSC_GROUP_OPTIONS: { value: HSCGroup; label: string }[] = [
  { value: 'science', label: 'Science' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'arts', label: 'Arts/Humanities' },
  { value: 'others', label: 'Others' }
];

// Default Scoring Weights
export const DEFAULT_WEIGHTS: ScoringWeights = {
  affordability: 25,
  gpaFit: 20,
  location: 15,
  quality: 20,
  facilities: 10,
  reputation: 10
};

// Budget Ranges (in BDT)
export const BUDGET_RANGES = [
  { value: 200000, label: 'Up to ৳2,00,000' },
  { value: 400000, label: 'Up to ৳4,00,000' },
  { value: 600000, label: 'Up to ৳6,00,000' },
  { value: 800000, label: 'Up to ৳8,00,000' },
  { value: 1000000, label: 'Up to ৳10,00,000' },
  { value: 1500000, label: 'Up to ৳15,00,000' },
  { value: 2000000, label: 'Up to ৳20,00,000' },
  { value: 999999999, label: 'No Budget Constraint' }
];

// GPA Ranges
export const GPA_RANGES = [
  { value: 5.0, label: 'GPA 5.0 (Golden A+)' },
  { value: 4.5, label: 'GPA 4.5 - 4.99' },
  { value: 4.0, label: 'GPA 4.0 - 4.49' },
  { value: 3.5, label: 'GPA 3.5 - 3.99' },
  { value: 3.0, label: 'GPA 3.0 - 3.49' },
  { value: 2.5, label: 'Below GPA 3.0' }
];
