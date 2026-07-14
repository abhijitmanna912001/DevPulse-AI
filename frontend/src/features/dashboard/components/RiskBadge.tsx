import { AlertTriangle, CheckCircle2, Flame } from 'lucide-react';

import { Badge } from '../../../components/ui/badge';
import { cn } from '../../../lib/utils';
import type { RiskLevel } from '../../../types/dashboard';

const riskStyles: Record<RiskLevel, string> = {
  LOW: 'border-green-200 bg-green-50 text-green-700',
  MODERATE: 'border-amber-200 bg-amber-50 text-amber-700',
  HIGH: 'border-orange-200 bg-orange-50 text-orange-700',
  CRITICAL: 'border-red-200 bg-red-50 text-red-700',
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const Icon = level === 'LOW' ? CheckCircle2 : level === 'MODERATE' ? AlertTriangle : Flame;

  return (
    <Badge className={cn(riskStyles[level], className)}>
      <Icon className="mr-1.5 h-3.5 w-3.5" />
      {formatRiskLevel(level)}
    </Badge>
  );
}

function formatRiskLevel(level: RiskLevel) {
  return `${level.charAt(0)}${level.slice(1).toLowerCase()}`;
}
