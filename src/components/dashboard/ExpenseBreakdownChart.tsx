'use client';

import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { ExpenseBreakdownItem } from '@/types';

export default function ExpenseBreakdownChart() {
  const { data } = useQuery({
    queryKey: ['analytics', '30d'],
    queryFn: async () => {
      const res = await fetch('/api/analytics?timeframe=30d');
      const json = await res.json();
      return json.data;
    },
  });

  const breakdownData: ExpenseBreakdownItem[] = data?.expenseBreakdown || [
    { category: 'Software & Tools', amount: 185000, percentage: 38, color: '#6366f1' },
    { category: 'Marketing', amount: 120000, percentage: 25, color: '#10b981' },
    { category: 'Utilities', amount: 80000, percentage: 17, color: '#f59e0b' },
    { category: 'Office Supplies', amount: 65000, percentage: 13, color: '#ec4899' },
    { category: 'Other', amount: 35000, percentage: 7, color: '#8b5cf6' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Expense Breakdown</h3>
        <p className="text-xs text-slate-400">Distribution by category</p>
      </div>

      <div className="h-44 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={breakdownData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="amount"
            >
              {breakdownData.map((entry: ExpenseBreakdownItem, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const itemData = payload[0].payload as ExpenseBreakdownItem;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-0.5 border border-slate-800">
                      <p className="font-bold">{itemData.category}</p>
                      <p className="text-indigo-400">{formatCurrency(itemData.amount)} ({itemData.percentage}%)</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend List */}
      <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        {breakdownData.slice(0, 4).map((item: ExpenseBreakdownItem) => (
          <div key={item.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                {item.category}
              </span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
