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

function sanitizeDraftProfile(value: unknown): Partial<StudentProfile> {
  if (!value || typeof value !== 'object') {
    return { ...initialDraft };
  }

  const candidate = value as Partial<StudentProfile>;
  return {
    ...candidate,
    preferredAreas: Array.isArray(candidate.preferredAreas) ? candidate.preferredAreas : [],
    academicInterests: Array.isArray(candidate.academicInterests) ? candidate.academicInterests : [],
    orderedPriorities: Array.isArray(candidate.orderedPriorities) ? candidate.orderedPriorities : [],
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      submittedProfile: null,
      draftProfile: { ...initialDraft },
      recommendations: [],
      loginLabel: 'Guest',
      login: (label = 'Student') => set({ isLoggedIn: true, loginLabel: label }),
      logout: () => set({ isLoggedIn: false, loginLabel: 'Guest' }),
      updateDraftProfile: (updates) => set((state) => ({
        draftProfile: sanitizeDraftProfile({ ...state.draftProfile, ...updates }),
      })),
      clearDraftProfile: () => set({ draftProfile: { ...initialDraft }, recommendations: [], submittedProfile: null }),
      submitProfile: (profile) => set({
        submittedProfile: profile,
        draftProfile: sanitizeDraftProfile(profile),
        recommendations: generateRecommendations(profile),
      }),
    }),
    {
      name: 'unimatch-app',
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return {
            isLoggedIn: false,
            loginLabel: 'Guest',
            draftProfile: { ...initialDraft },
          };
        }

        const state = persistedState as Partial<AppState>;
        return {
          isLoggedIn: Boolean(state.isLoggedIn),
          loginLabel: typeof state.loginLabel === 'string' ? state.loginLabel : 'Guest',
          draftProfile: sanitizeDraftProfile(state.draftProfile),
        };
      },
      merge: (persistedState, currentState) => {
        const state = (persistedState && typeof persistedState === 'object') ? persistedState as Partial<AppState> : {};
        return {
          ...currentState,
          isLoggedIn: Boolean(state.isLoggedIn),
          loginLabel: typeof state.loginLabel === 'string' ? state.loginLabel : currentState.loginLabel,
          draftProfile: sanitizeDraftProfile(state.draftProfile),
          submittedProfile: null,
          recommendations: [],
        };
      },
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        loginLabel: state.loginLabel,
        draftProfile: sanitizeDraftProfile(state.draftProfile),
      }),
    },
  ),
);
