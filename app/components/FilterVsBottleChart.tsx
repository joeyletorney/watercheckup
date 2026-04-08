'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type FilterVsBottleRow = { year: string; filter: number; bottled: number };

export default function FilterVsBottleChart({ data }: { data: FilterVsBottleRow[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gF" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0891b2" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#0e2233" />
        <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v: number) => `$${v}`} />
        <Tooltip
          contentStyle={{ background: '#0b1e36', border: '1px solid #1e3a4a', borderRadius: 8 }}
          labelStyle={{ color: '#94a3b8', fontSize: 11 }}
          formatter={(v: number) => [`$${v}`, '']}
        />
        <Area type="monotone" dataKey="filter" name="Filter System" stroke="#0891b2" fill="url(#gF)" strokeWidth={2} />
        <Area type="monotone" dataKey="bottled" name="Bottled Water" stroke="#ef4444" fill="url(#gB)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
