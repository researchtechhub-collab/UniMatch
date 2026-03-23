export type UgcStatus = 'approved' | 'warning';
export type EducationGroup = 'science' | 'business' | 'humanities' | 'other';
export type LivingCostTier = 'low-cost' | 'medium-cost' | 'high-cost';

export interface DhakaArea {
  id: string;
  label: string;
  livingCost: LivingCostTier;
}

export interface ScholarshipPolicy {
  minCombinedGpa: number;
  waiver: string;
  note: string;
}

export interface ProgramCategory {
  id: string;
  title: string;
  examples: string[];
}

export interface DepartmentProgram {
  id: string;
  universityId: string;
  name: string;
  categoryId: string;
  totalCost: number;
  minimumGpa: number;
  contact: string;
  scholarshipInfo: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  areaId: string;
  address: string;
  website: string;
  phone: string;
  email: string;
  description: string;
  ranking: number;
  establishedYear: number;
  ugcStatus: UgcStatus;
  ugcNote: string;
  tuitionRange: [number, number];
  strengths: string[];
  facilities: string[];
  scholarshipPolicies: ScholarshipPolicy[];
  admissionBanner: string;
  logoSeed: string;
}

export interface PriorityOption {
  id: 'affordability' | 'gpa' | 'quality' | 'reputation' | 'facilities';
  label: string;
}

export interface StudentProfile {
  hscGpa: number;
  hscGroup: EducationGroup;
  hscPassingYear: number;
  sscGpa: number;
  sscGroup: EducationGroup;
  sscPassingYear: number;
  budgetRange: string;
  availableWaiver: string;
  preferredAreas: string[];
  academicInterests: string[];
  orderedPriorities: PriorityOption['id'][];
}

export interface Recommendation {
  university: University;
  program: DepartmentProgram;
  score: number;
  waiverEstimate: string;
  reasons: string[];
}

export interface AppRoute {
  path: '/' | '/finder' | '/about' | '/universities' | `/universities/${string}`;
}

export const priorityOptions: PriorityOption[] = [
  { id: 'affordability', label: 'Affordability' },
  { id: 'gpa', label: 'GPA Requirements' },
  { id: 'quality', label: 'Academic Quality' },
  { id: 'reputation', label: 'University Reputation' },
  { id: 'facilities', label: 'Campus Facilities' },
];

export const dhakaAreas: DhakaArea[] = [
  { id: 'uttara', label: 'Uttara', livingCost: 'medium-cost' },
  { id: 'banani', label: 'Banani', livingCost: 'high-cost' },
  { id: 'bashundhara', label: 'Bashundhara', livingCost: 'high-cost' },
  { id: 'ashulia', label: 'Ashulia', livingCost: 'low-cost' },
  { id: 'farmgate', label: 'Farmgate', livingCost: 'medium-cost' },
  { id: 'mirpur', label: 'Mirpur', livingCost: 'medium-cost' },
  { id: 'motijheel', label: 'Motijheel', livingCost: 'medium-cost' },
  { id: 'gulshan', label: 'Gulshan', livingCost: 'high-cost' },
  { id: 'dhanmondi', label: 'Dhanmondi', livingCost: 'high-cost' },
  { id: 'badda', label: 'Badda', livingCost: 'medium-cost' },
  { id: 'aftabnagar', label: 'Aftabnagar', livingCost: 'medium-cost' },
  { id: 'tejgaon', label: 'Tejgaon', livingCost: 'medium-cost' },
];

export const academicCategories: ProgramCategory[] = [
  { id: 'agriculture-environmental', title: 'Agriculture & Environmental', examples: ['Environmental Science', 'Climate Studies', 'Agri Business'] },
  { id: 'arts-design-architecture', title: 'Arts, Design & Architecture', examples: ['Architecture', 'Interior Design', 'Fine Arts'] },
  { id: 'business-management', title: 'Business & Management', examples: ['BBA', 'Finance', 'Marketing'] },
  { id: 'engineering-technology', title: 'Engineering & Technology', examples: ['CSE', 'EEE', 'Civil Engineering'] },
  { id: 'hospitality-leisure-sports', title: 'Hospitality, Leisure & Sports', examples: ['Tourism', 'Hospitality Management', 'Sports Science'] },
  { id: 'humanities', title: 'Humanities', examples: ['English', 'Philosophy', 'Islamic Studies'] },
  { id: 'journalism-media', title: 'Journalism & Media', examples: ['Media Studies', 'Communication', 'Broadcast Journalism'] },
  { id: 'law', title: 'Law', examples: ['LLB', 'Corporate Law', 'Human Rights Law'] },
  { id: 'pharmacy-public-health', title: 'Pharmacy and Public Health', examples: ['Pharmacy', 'Public Health', 'Nutrition'] },
  { id: 'natural-sciences-mathematics', title: 'Natural Sciences & Mathematics', examples: ['Biotechnology', 'Mathematics', 'Physics'] },
  { id: 'social-sciences', title: 'Social Sciences', examples: ['Economics', 'Development Studies', 'Sociology'] },
];

export const budgetRanges = [
  '200,000–300,000 BDT',
  '300,000–400,000 BDT',
  '400,000–500,000 BDT',
  '500,000–600,000 BDT',
  '600,000–700,000 BDT',
  '700,000–800,000 BDT',
  '800,000–900,000 BDT',
  '900,000–1,000,000 BDT',
  '1,000,000–1,200,000 BDT',
  'No Budget Constraint',
] as const;

export const waiverBands = [
  'Up to 10% waiver',
  '15%–25% waiver',
  '30%–50% waiver',
  '50%–100% waiver',
  'I will apply based on merit only',
] as const;

export const combinedGpaWaiverGuide = [
  { minimum: 10, waiver: '50%–100%', note: 'Top-tier combined GPA profile' },
  { minimum: 9.5, waiver: '30%–50%', note: 'Strong academic standing' },
  { minimum: 9, waiver: '15%–25%', note: 'Competitive merit waiver band' },
  { minimum: 8, waiver: 'Up to 10%', note: 'Entry-level merit consideration' },
];
