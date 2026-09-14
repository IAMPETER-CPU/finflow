'use client';

import Link from 'next/link';
import { ShieldAlert, ShieldCheck, ArrowRight } from 'lucide-react';
import { useKycStore } from '@/store/useKycStore';

export default function KycBanner() {
  const { kyc } = useKycStore();
  const isVerified = kyc.status === 'verified';

  if (isVerified) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Account Fully Verified
                </h3>
                <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Your identity has been verified. Global transfers and unlimited payouts are active.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white dark:bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs sm:text-sm text-white">
                Identity verification in progress
              </h3>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                {kyc.progressPercentage}% Complete
              </span>
            </div>
            <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5">
              Verify your identity to unlock all FinFlow features and enable international payouts.
            </p>

            {/* Clean Progress Bar */}
            <div className="w-full sm:w-64 h-1.5 bg-white/10 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${kyc.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/verification"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-xs transition-all shrink-0 self-start sm:self-auto"
        >
          <span>Continue Verification</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
