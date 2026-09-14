import { create } from 'zustand';
import { KYCVerification, KYCStatus } from '@/types';
import { defaultKycStatus } from '@/lib/mock-data/seed';

interface KycState {
  kyc: KYCVerification;
  updateStep: (step: number) => void;
  updatePersonalInfo: (info: Partial<KYCVerification['personalInfo']>) => void;
  updateDocument: (doc: Partial<KYCVerification['document']>) => void;
  setSelfieVerified: (verified: boolean) => void;
  submitKyc: () => void;
  setKycVerified: () => void;
}

export const useKycStore = create<KycState>((set) => ({
  kyc: defaultKycStatus,

  updateStep: (step) =>
    set((state) => ({
      kyc: {
        ...state.kyc,
        step,
        progressPercentage: Math.min(100, step * 25),
      },
    })),

  updatePersonalInfo: (info) =>
    set((state) => ({
      kyc: {
        ...state.kyc,
        personalInfo: { ...state.kyc.personalInfo, ...info },
        step: 2,
        progressPercentage: 50,
      },
    })),

  updateDocument: (doc) =>
    set((state) => ({
      kyc: {
        ...state.kyc,
        document: { ...state.kyc.document, ...doc },
        step: 3,
        progressPercentage: 75,
      },
    })),

  setSelfieVerified: (verified) =>
    set((state) => ({
      kyc: {
        ...state.kyc,
        selfieVerified: verified,
        step: 4,
        progressPercentage: 90,
      },
    })),

  submitKyc: () =>
    set((state) => ({
      kyc: {
        ...state.kyc,
        status: 'pending_review',
        progressPercentage: 95,
        submittedAt: new Date().toISOString(),
      },
    })),

  setKycVerified: () =>
    set((state) => ({
      kyc: {
        ...state.kyc,
        status: 'verified',
        progressPercentage: 100,
      },
    })),
}));
