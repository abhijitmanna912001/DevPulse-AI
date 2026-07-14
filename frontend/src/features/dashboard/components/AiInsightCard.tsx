import { Lightbulb, Sparkles } from 'lucide-react';

import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import type { DashboardData } from '../../../types/dashboard';

export function AiInsightCard({ insight }: { insight: DashboardData['latestInsight'] }) {
  return (
    <Card className="border-violet-200 bg-violet-50/60">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-violet-950">
            <Sparkles className="h-4 w-4 text-ai" />
            Latest AI Insight
          </CardTitle>
          <p className="mt-1 text-xs text-violet-700">Explanation only, not risk scoring</p>
        </div>
        {insight ? (
          <Badge className="border-violet-200 bg-white/70 text-violet-700">{insight.period}</Badge>
        ) : null}
      </CardHeader>
      <CardContent>
        {insight ? (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-violet-950">{insight.summary}</p>
            <div className="flex gap-3 rounded-card border border-violet-200 bg-white/70 p-3">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-ai" />
              <p className="text-sm font-medium leading-6 text-violet-900">
                {insight.recommendedAction}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-6 text-violet-800">
            No AI insight has been generated yet. The dashboard can still show deterministic scores
            and trends.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
