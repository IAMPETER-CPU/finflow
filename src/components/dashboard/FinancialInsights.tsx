'use client';

import Link from 'next/link';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { FinancialInsight } from '@/types';

interface FinancialInsightsProps {
  insights: FinancialInsight[];
}

export default function FinancialInsights({ insights }: FinancialInsightsProps) {
  const getIcon = (type: FinancialInsight['type']) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-slate-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Insights</h3>
          <p className="text-[11px] text-slate-400">Automated intelligence derived from your accounts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700">
                  {getIcon(insight.type)}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {insight.title}
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {insight.description}
              </p>
            </div>

            {insight.actionLabel && insight.actionUrl && (
              <Link
                href={insight.actionUrl}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 dark:text-white hover:underline pt-2 border-t border-slate-200/40 dark:border-slate-700/40"
              >
                <span>{insight.actionLabel}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
