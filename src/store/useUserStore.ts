import { create } from 'zustand';
import { defaultUser } from '@/lib/mock-data/seed';
import { UserProfile } from '@/types';

interface UserState {
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: { ...defaultUser },
  updateUser: (updated) =>
    set((state) => ({
      user: { ...state.user, ...updated },
    })),
  resetUser: () => set({ user: { ...defaultUser } }),
}));
