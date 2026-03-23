// Zustand Store for UniMatch Bangladesh
// Manages application state for student profile, recommendations, and UI

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  StudentProfile, 
  Recommendation, 
  FormStep,
  ScoringWeights 
} from '@/types';
import { DEFAULT_WEIGHTS } from '@/types';

// Interface for the store state
interface AppState {
  // Current form step
  currentStep: FormStep;
  setCurrentStep: (step: FormStep) => void;
  
  // Student profile
  studentProfile: Partial<StudentProfile>;
  updateStudentProfile: (updates: Partial<StudentProfile>) => void;
  resetStudentProfile: () => void;
  
  // Scoring weights
  scoringWeights: ScoringWeights;
  updateScoringWeights: (weights: Partial<ScoringWeights>) => void;
  resetScoringWeights: () => void;
  
  // Recommendations
  recommendations: Recommendation[];
  setRecommendations: (recommendations: Recommendation[]) => void;
  savedRecommendations: string[]; // IDs of saved recommendations
  toggleSaveRecommendation: (recommendationId: string) => void;
  
  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  // Filters
  minMatchScore: number;
  setMinMatchScore: (score: number) => void;
  selectedFaculties: string[];
  toggleFacultyFilter: (faculty: string) => void;
  
  // Session
  sessionId: string;
}

// Generate a unique session ID
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substring(2, 15);
};

// Initial student profile
const initialStudentProfile: Partial<StudentProfile> = {
  hscGpa: undefined,
  hscGroup: undefined,
  maxBudgetTotal: undefined,
  preferredDistricts: [],
  requiresHousing: false,
  preferredFaculties: [],
  requiresScholarship: false,
  weightAffordability: DEFAULT_WEIGHTS.affordability,
  weightGpaFit: DEFAULT_WEIGHTS.gpaFit,
  weightLocation: DEFAULT_WEIGHTS.location,
  weightQuality: DEFAULT_WEIGHTS.quality,
  weightFacilities: DEFAULT_WEIGHTS.facilities,
  weightReputation: DEFAULT_WEIGHTS.reputation
};

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      // Form step
      currentStep: 'academic',
      setCurrentStep: (step) => set({ currentStep: step }),
      
      // Student profile
      studentProfile: initialStudentProfile,
      updateStudentProfile: (updates) => set((state) => ({
        studentProfile: { ...state.studentProfile, ...updates }
      })),
      resetStudentProfile: () => set({ 
        studentProfile: initialStudentProfile,
        recommendations: [],
        savedRecommendations: []
      }),
      
      // Scoring weights
      scoringWeights: DEFAULT_WEIGHTS,
      updateScoringWeights: (weights) => set((state) => ({
        scoringWeights: { ...state.scoringWeights, ...weights }
      })),
      resetScoringWeights: () => set({ scoringWeights: DEFAULT_WEIGHTS }),
      
      // Recommendations
      recommendations: [],
      setRecommendations: (recommendations) => set({ recommendations }),
      savedRecommendations: [],
      toggleSaveRecommendation: (recommendationId) => set((state) => {
        const isSaved = state.savedRecommendations.includes(recommendationId);
        if (isSaved) {
          return {
            savedRecommendations: state.savedRecommendations.filter(id => id !== recommendationId)
          };
        } else {
          return {
            savedRecommendations: [...state.savedRecommendations, recommendationId]
          };
        }
      }),
      
      // UI State
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      error: null,
      setError: (error) => set({ error }),
      
      // Filters
      minMatchScore: 0,
      setMinMatchScore: (score) => set({ minMatchScore: score }),
      selectedFaculties: [],
      toggleFacultyFilter: (faculty) => set((state) => {
        const isSelected = state.selectedFaculties.includes(faculty);
        if (isSelected) {
          return {
            selectedFaculties: state.selectedFaculties.filter(f => f !== faculty)
          };
        } else {
          return {
            selectedFaculties: [...state.selectedFaculties, faculty]
          };
        }
      }),
      
      // Session
      sessionId: generateSessionId()
    }),
    {
      name: 'unimatch-storage',
      partialize: (state) => ({
        studentProfile: state.studentProfile,
        savedRecommendations: state.savedRecommendations,
        sessionId: state.sessionId
      })
    }
  )
);

// Selector hooks for better performance
export const useStudentProfile = () => useAppStore(state => state.studentProfile);
export const useRecommendations = () => useAppStore(state => state.recommendations);
export const useCurrentStep = () => useAppStore(state => state.currentStep);
export const useIsLoading = () => useAppStore(state => state.isLoading);
export const useScoringWeights = () => useAppStore(state => state.scoringWeights);
