import { Bot, CalendarDays, Code2, Footprints, Moon, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AiInsightCard } from '../features/dashboard/components/AiInsightCard';
import { BurnoutRiskCard } from '../features/dashboard/components/BurnoutRiskCard';
import { DashboardError } from '../features/dashboard/components/DashboardError';
import { DashboardLoading } from '../features/dashboard/components/DashboardLoading';
import { RecoveryScoreCard } from '../features/dashboard/components/RecoveryScoreCard';
import { RiskBadge } from '../features/dashboard/components/RiskBadge';
import { StatCard } from '../features/dashboard/components/StatCard';
import { TrendChartCard } from '../features/dashboard/components/TrendChartCard';
import { useDashboard } from '../features/dashboard/useDashboard';

export function DashboardPage() {
  const navigate = useNavigate();
  const dashboardQuery = useDashboard();

  if (dashboardQuery.isLoading) {
    return <DashboardLoading />;
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return <DashboardError onRetry={() => void dashboardQuery.refetch()} />;
  }

  const { data, meta } = dashboardQuery.data;
  const latestEntry = data.latestEntry;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">DevPulse AI</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-normal text-slate-950">
                {data.demoUser.displayName}'s dashboard
              </h1>
              <RiskBadge level={data.scores.riskLevel} />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Demo User · {data.demoUser.role ?? 'Developer'} · Updated{' '}
              {formatDateTime(meta.computedAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => navigate('/ai-coach')}>
              <Bot className="h-4 w-4" />
              Ask AI Coach
            </Button>
            <Button onClick={() => navigate('/check-in')}>
              <CalendarDays className="h-4 w-4" />
              Log today's check-in
            </Button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <RecoveryScoreCard score={data.scores.recoveryScore} />
          <BurnoutRiskCard score={data.scores.burnoutRiskScore} level={data.scores.riskLevel} />
          <AiInsightCard insight={data.latestInsight} />
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Sleep"
            value={`${formatMetric(data.summaries.sleep.averageHours)}h`}
            detail={`Target ${data.summaries.sleep.targetHours}h average`}
            trend={data.summaries.sleep.trend}
            icon={Moon}
            accentClassName="bg-indigo-50 text-sleep"
          />
          <StatCard
            title="Mood"
            value={`${formatMetric(data.summaries.moodEnergy.averageMoodScore)}/5`}
            detail={`Energy ${formatMetric(data.summaries.moodEnergy.averageEnergyScore)}/5`}
            trend={data.summaries.moodEnergy.trend}
            icon={Smile}
            accentClassName="bg-pink-50 text-mood"
          />
          <StatCard
            title="Activity"
            value={formatWhole(data.summaries.activity.averageSteps)}
            detail={`Target ${formatWhole(data.summaries.activity.targetSteps)} steps`}
            trend={data.summaries.activity.trend}
            icon={Footprints}
            accentClassName="bg-green-50 text-activity"
          />
          <StatCard
            title="Workload"
            value={`${formatMetric(data.summaries.workload.averageWorkHours)}h`}
            detail={`${formatWhole(data.summaries.workload.averageCodingMinutes)} coding minutes`}
            trend={data.summaries.workload.trend}
            icon={Code2}
            accentClassName="bg-orange-50 text-workload"
          />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <TrendChartCard summaries={data.summaries} />
          <Card>
            <CardHeader>
              <CardTitle>Latest Check-in</CardTitle>
              <p className="text-sm text-slate-500">
                {latestEntry ? latestEntry.entryDate : 'No wellness entry yet'}
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {latestEntry ? (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <CheckInMetric
                      label="Sleep"
                      value={`${formatMetric(latestEntry.sleepHours)}h`}
                    />
                    <CheckInMetric label="Work" value={`${formatMetric(latestEntry.workHours)}h`} />
                    <CheckInMetric label="Steps" value={formatWhole(latestEntry.steps)} />
                    <CheckInMetric label="Breaks" value={formatWhole(latestEntry.breakCount)} />
                  </div>
                  {latestEntry.notes ? (
                    <p className="rounded-card bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                      {latestEntry.notes}
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="text-sm leading-6 text-slate-500">
                  Log a check-in to see the latest wellness context.
                </p>
              )}

              <div>
                <h2 className="text-sm font-semibold text-slate-900">Recommendations</h2>
                <ul className="mt-3 space-y-2">
                  {data.recommendations.map((recommendation) => (
                    <li
                      key={recommendation}
                      className="rounded-card border border-border bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600"
                    >
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function CheckInMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}

function formatMetric(value: number | null) {
  return value === null ? '-' : value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

function formatWhole(value: number | null) {
  return value === null ? '-' : Math.round(value).toLocaleString();
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}
