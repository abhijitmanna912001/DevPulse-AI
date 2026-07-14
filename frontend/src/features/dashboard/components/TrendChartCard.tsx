import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { DashboardData } from '../../../types/dashboard';

type ChartRow = {
  metric: string;
  current: number;
  target: number;
};

export function TrendChartCard({ summaries }: { summaries: DashboardData['summaries'] }) {
  const chartData: ChartRow[] = [
    {
      metric: 'Sleep',
      current: summaries.sleep.averageHours ?? 0,
      target: summaries.sleep.targetHours,
    },
    {
      metric: 'Steps',
      current: Math.round((summaries.activity.averageSteps ?? 0) / 1000),
      target: Math.round(summaries.activity.targetSteps / 1000),
    },
    {
      metric: 'Mood',
      current: summaries.moodEnergy.averageMoodScore ?? 0,
      target: 5,
    },
    {
      metric: 'Energy',
      current: summaries.moodEnergy.averageEnergyScore ?? 0,
      target: 5,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Snapshot</CardTitle>
        <p className="text-sm text-slate-500">Current averages compared with healthy targets</p>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="metric" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: '#F1F5F9' }}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                }}
              />
              <Bar dataKey="target" name="Target" fill="#CBD5E1" radius={[6, 6, 0, 0]} />
              <Bar
                dataKey="current"
                name="Current"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
