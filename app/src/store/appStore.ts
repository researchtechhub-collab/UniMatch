import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateRecommendations } from '@/lib/recommendationEngine';
import { type Recommendation, type StudentProfile } from '@/types';

interface AppState {
  isLoggedIn: boolean;
  submittedProfile: StudentProfile | null;
  draftProfile: Partial<StudentProfile>;
  recommendations: Recommendation[];
  loginLabel: string;
  login: (label?: string) => void;
  logout: () => void;
  updateDraftProfile: (updates: Partial<StudentProfile>) => void;
  clearDraftProfile: () => void;
  submitProfile: (profile: StudentProfile) => void;
}

const initialDraft: Partial<StudentProfile> = {
  preferredAreas: [],
  academicInterests: [],
  orderedPriorities: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      submittedProfile: null,
      draftProfile: initialDraft,
      recommendations: [],
      loginLabel: 'Guest',
      login: (label = 'Student') => set({ isLoggedIn: true, loginLabel: label }),
      logout: () => set({ isLoggedIn: false, loginLabel: 'Guest' }),
      updateDraftProfile: (updates) => set((state) => ({ draftProfile: { ...state.draftProfile, ...updates } })),
      clearDraftProfile: () => set({ draftProfile: initialDraft, recommendations: [], submittedProfile: null }),
      submitProfile: (profile) => set({ submittedProfile: profile, draftProfile: profile, recommendations: generateRecommendations(profile) }),
    }),
    {
      name: 'unimatch-app',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        loginLabel: state.loginLabel,
        draftProfile: state.draftProfile,
        submittedProfile: state.submittedProfile,
        recommendations: state.recommendations,
      }),
    },
  ),
);
