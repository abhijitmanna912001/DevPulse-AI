import { Flame } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { RiskLevel } from '../../../types/dashboard';
import { RiskBadge } from './RiskBadge';

export function BurnoutRiskCard({ score, level }: { score: number; level: RiskLevel }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Burnout Risk</CardTitle>
          <p className="mt-1 text-xs text-slate-500">Deterministic risk engine</p>
        </div>
        <Flame className="h-5 w-5 text-workload" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-4xl font-bold text-slate-950">{score}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">out of 100</p>
          </div>
          <RiskBadge level={level} />
        </div>
        <div className="mt-5 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-workload transition-all"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          Risk increases when low recovery combines with long work hours, heavy coding time, and
          fewer breaks.
        </p>
      </CardContent>
    </Card>
  );
}
