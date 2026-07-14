import { Activity } from 'lucide-react';
import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

export function RecoveryScoreCard({ score }: { score: number }) {
  const chartData = [{ name: 'Recovery', value: score, fill: 'hsl(var(--recovery))' }];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recovery Score</CardTitle>
          <p className="mt-1 text-xs text-slate-500">Backend-calculated readiness</p>
        </div>
        <Activity className="h-5 w-5 text-recovery" />
      </CardHeader>
      <CardContent className="flex items-center gap-5">
        <div className="relative h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="72%"
              outerRadius="100%"
              startAngle={90}
              endAngle={90 - score * 3.6}
            >
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#E2E8F0' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-4xl font-bold text-slate-950">{score}</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">
            {score >= 70 ? 'Strong' : 'Watchful'}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Higher recovery means sleep, energy, movement, and workload are better balanced today.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
