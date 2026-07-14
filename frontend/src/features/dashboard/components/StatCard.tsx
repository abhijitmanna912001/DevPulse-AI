import { ArrowDown, ArrowRight, ArrowUp, type LucideIcon } from 'lucide-react';

import { Card, CardContent } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';
import type { TrendDirection } from '../../../types/dashboard';

const trendCopy: Record<TrendDirection, string> = {
  UP: 'Trending up',
  DOWN: 'Trending down',
  FLAT: 'Stable',
};

export function StatCard({
  title,
  value,
  detail,
  trend,
  icon: Icon,
  accentClassName,
}: {
  title: string;
  value: string;
  detail: string;
  trend: TrendDirection;
  icon: LucideIcon;
  accentClassName: string;
}) {
  const TrendIcon = trend === 'UP' ? ArrowUp : trend === 'DOWN' ? ArrowDown : ArrowRight;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-600">{title}</p>
            <p className="mt-2 font-mono text-3xl font-bold text-slate-950">{value}</p>
          </div>
          <div className={cn('rounded-card p-2.5', accentClassName)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-500">{detail}</p>
        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <TrendIcon className="h-3.5 w-3.5" />
          {trendCopy[trend]}
        </div>
      </CardContent>
    </Card>
  );
}
