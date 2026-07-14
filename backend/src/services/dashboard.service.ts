import { env } from '../config/env.js';
import { prisma } from '../db/prisma.js';

type TrendDirection = 'UP' | 'DOWN' | 'FLAT';
type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

type NumericLike = {
  toString(): string;
};

export type DashboardQuery = {
  windowDays: 7 | 30;
};

export type DashboardData = {
  demoUser: {
    displayName: string;
    role: string | null;
  };
  latestEntry: SerializedWellnessEntry | null;
  scores: {
    recoveryScore: number;
    burnoutRiskScore: number;
    riskLevel: RiskLevel;
  };
  summaries: {
    sleep: {
      averageHours: number | null;
      targetHours: number;
      trend: TrendDirection;
    };
    activity: {
      averageSteps: number | null;
      targetSteps: number;
      trend: TrendDirection;
    };
    workload: {
      averageWorkHours: number | null;
      averageCodingMinutes: number | null;
      trend: TrendDirection;
    };
    moodEnergy: {
      averageMoodScore: number | null;
      averageEnergyScore: number | null;
      trend: TrendDirection;
    };
  };
  recommendations: string[];
  latestInsight: {
    id: string;
    period: string;
    summary: string;
    recommendedAction: string;
    createdAt: string;
  } | null;
};

type SerializedWellnessEntry = {
  id: string;
  entryDate: string;
  sleepHours: number | null;
  sleepQuality: number | null;
  steps: number | null;
  exerciseMinutes: number | null;
  moodScore: number | null;
  energyScore: number | null;
  workHours: number | null;
  codingMinutes: number | null;
  breakCount: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

type WellnessEntryMetric = {
  sleepHours: NumericLike | null;
  sleepQuality: number | null;
  steps: number | null;
  exerciseMinutes: number | null;
  moodScore: number | null;
  energyScore: number | null;
  workHours: NumericLike | null;
  codingMinutes: number | null;
  breakCount: number | null;
};

export async function getDashboardData({ windowDays }: DashboardQuery): Promise<DashboardData> {
  const demoUser = await prisma.user.findFirst({
    where: {
      OR: [{ id: env.DEMO_USER_ID }, { demoKey: 'default-demo-user' }],
    },
    include: {
      profile: true,
    },
  });

  if (!demoUser) {
    throw new Error('Demo User has not been seeded.');
  }

  const [entries, latestInsight] = await Promise.all([
    prisma.wellnessEntry.findMany({
      where: {
        userId: demoUser.id,
      },
      orderBy: {
        entryDate: 'desc',
      },
      take: windowDays,
    }),
    prisma.insightSnapshot.findFirst({
      where: {
        userId: demoUser.id,
      },
      orderBy: [{ periodStart: 'desc' }, { createdAt: 'desc' }],
    }),
  ]);

  const targetHours = roundMetric(toNumber(demoUser.profile?.preferredSleepHours) ?? 7.5);
  const targetSteps = demoUser.profile?.preferredDailySteps ?? 8000;
  const chronologicalEntries = [...entries].reverse();
  const latestEntry = entries[0] ?? null;
  const scores = calculateScores(latestEntry, chronologicalEntries, targetHours, targetSteps);

  return {
    demoUser: {
      displayName: demoUser.displayName,
      role: demoUser.profile?.role ?? null,
    },
    latestEntry: latestEntry ? serializeWellnessEntry(latestEntry) : null,
    scores,
    summaries: {
      sleep: {
        averageHours: averageDecimal(chronologicalEntries, (entry) => entry.sleepHours),
        targetHours,
        trend: calculateTrend(chronologicalEntries, (entry) => toNumber(entry.sleepHours)),
      },
      activity: {
        averageSteps: averageNumber(chronologicalEntries, (entry) => entry.steps),
        targetSteps,
        trend: calculateTrend(chronologicalEntries, (entry) => entry.steps),
      },
      workload: {
        averageWorkHours: averageDecimal(chronologicalEntries, (entry) => entry.workHours),
        averageCodingMinutes: averageNumber(chronologicalEntries, (entry) => entry.codingMinutes),
        trend: calculateTrend(chronologicalEntries, (entry) => toNumber(entry.workHours)),
      },
      moodEnergy: {
        averageMoodScore: averageNumber(chronologicalEntries, (entry) => entry.moodScore),
        averageEnergyScore: averageNumber(chronologicalEntries, (entry) => entry.energyScore),
        trend: calculateTrend(chronologicalEntries, (entry) => {
          const moodScore = entry.moodScore ?? null;
          const energyScore = entry.energyScore ?? null;

          if (moodScore === null && energyScore === null) {
            return null;
          }

          return ((moodScore ?? 3) + (energyScore ?? 3)) / 2;
        }),
      },
    },
    recommendations: buildRecommendations(latestEntry, scores, targetHours, targetSteps),
    latestInsight: latestInsight
      ? {
          id: latestInsight.id,
          period: latestInsight.period,
          summary: latestInsight.summary,
          recommendedAction: latestInsight.recommendedAction,
          createdAt: latestInsight.createdAt.toISOString(),
        }
      : null,
  };
}

function calculateScores(
  latestEntry: WellnessEntryMetric | null,
  entries: WellnessEntryMetric[],
  targetHours: number,
  targetSteps: number,
): DashboardData['scores'] {
  if (!latestEntry) {
    return {
      recoveryScore: 50,
      burnoutRiskScore: 50,
      riskLevel: 'MODERATE',
    };
  }

  const sleepHours = toNumber(latestEntry.sleepHours) ?? targetHours;
  const sleepQuality = latestEntry.sleepQuality ?? 3;
  const steps = latestEntry.steps ?? Math.round(targetSteps * 0.6);
  const exerciseMinutes = latestEntry.exerciseMinutes ?? 0;
  const moodScore = latestEntry.moodScore ?? 3;
  const energyScore = latestEntry.energyScore ?? 3;
  const workHours = toNumber(latestEntry.workHours) ?? 8;
  const codingMinutes = latestEntry.codingMinutes ?? 300;
  const breakCount = latestEntry.breakCount ?? 3;

  const recoveryScore = Math.round(
    clamp(
      15 +
        ratioScore(sleepHours, targetHours, 30) +
        ratioScore(sleepQuality, 5, 10) +
        ratioScore(steps, targetSteps, 15) +
        ratioScore(exerciseMinutes, 30, 5) +
        ratioScore(moodScore + energyScore, 10, 20) +
        ratioScore(breakCount, 6, 5) -
        Math.max(0, workHours - 8) * 4 -
        Math.max(0, codingMinutes - 360) * 0.05,
      0,
      100,
    ),
  );

  const averageWorkHours = averageDecimal(entries, (entry) => entry.workHours) ?? workHours;
  const averageCodingMinutes =
    averageNumber(entries, (entry) => entry.codingMinutes) ?? codingMinutes;
  const burnoutRiskScore = Math.round(
    clamp(
      100 -
        recoveryScore +
        Math.max(0, averageWorkHours - 8) * 4 +
        Math.max(0, averageCodingMinutes - 360) * 0.04 +
        Math.max(0, targetHours - sleepHours) * 4,
      0,
      100,
    ),
  );

  return {
    recoveryScore,
    burnoutRiskScore,
    riskLevel: toRiskLevel(burnoutRiskScore),
  };
}

function buildRecommendations(
  latestEntry: WellnessEntryMetric | null,
  scores: DashboardData['scores'],
  targetHours: number,
  targetSteps: number,
): string[] {
  if (!latestEntry) {
    return ["Log today's wellness check-in to unlock personalized dashboard recommendations."];
  }

  const recommendations: string[] = [];
  const sleepHours = toNumber(latestEntry.sleepHours);
  const workHours = toNumber(latestEntry.workHours);
  const steps = latestEntry.steps;
  const breakCount = latestEntry.breakCount;

  if (sleepHours !== null && sleepHours < targetHours) {
    recommendations.push('Avoid extending work late tonight after below-target sleep.');
  }

  if (steps !== null && steps < targetSteps) {
    recommendations.push('Take two short movement breaks today.');
  }

  if (workHours !== null && workHours > 9) {
    recommendations.push('Keep the next coding block shorter and schedule a clear stop time.');
  }

  if (breakCount !== null && breakCount < 4) {
    recommendations.push('Add one protected recovery break before your next deep-work session.');
  }

  if (scores.riskLevel === 'HIGH' || scores.riskLevel === 'CRITICAL') {
    recommendations.push('Prioritize recovery work before taking on additional coding load.');
  }

  return recommendations.slice(0, 3);
}

function serializeWellnessEntry(entry: {
  id: string;
  entryDate: Date;
  sleepHours: NumericLike | null;
  sleepQuality: number | null;
  steps: number | null;
  exerciseMinutes: number | null;
  moodScore: number | null;
  energyScore: number | null;
  workHours: NumericLike | null;
  codingMinutes: number | null;
  breakCount: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): SerializedWellnessEntry {
  return {
    id: entry.id,
    entryDate: formatDate(entry.entryDate),
    sleepHours: toNumber(entry.sleepHours),
    sleepQuality: entry.sleepQuality,
    steps: entry.steps,
    exerciseMinutes: entry.exerciseMinutes,
    moodScore: entry.moodScore,
    energyScore: entry.energyScore,
    workHours: toNumber(entry.workHours),
    codingMinutes: entry.codingMinutes,
    breakCount: entry.breakCount,
    notes: entry.notes,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

function calculateTrend<TEntry>(
  entries: TEntry[],
  selectValue: (entry: TEntry) => number | null,
): TrendDirection {
  const values = entries.map(selectValue).filter((value): value is number => value !== null);

  if (values.length < 2) {
    return 'FLAT';
  }

  const midpoint = Math.floor(values.length / 2);
  const earlierAverage = average(values.slice(0, midpoint));
  const laterAverage = average(values.slice(midpoint));
  const delta = laterAverage - earlierAverage;
  const threshold = Math.max(0.25, Math.abs(earlierAverage) * 0.05);

  if (delta > threshold) {
    return 'UP';
  }

  if (delta < -threshold) {
    return 'DOWN';
  }

  return 'FLAT';
}

function averageDecimal<TEntry>(
  entries: TEntry[],
  selectValue: (entry: TEntry) => NumericLike | null,
): number | null {
  return averageNumber(entries, (entry) => toNumber(selectValue(entry)));
}

function averageNumber<TEntry>(
  entries: TEntry[],
  selectValue: (entry: TEntry) => number | null,
): number | null {
  const values = entries.map(selectValue).filter((value): value is number => value !== null);

  if (values.length === 0) {
    return null;
  }

  return roundMetric(average(values));
}

function average(values: number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function ratioScore(value: number, target: number, maxScore: number): number {
  if (target <= 0) {
    return 0;
  }

  return Math.min(value / target, 1) * maxScore;
}

function toRiskLevel(score: number): RiskLevel {
  if (score < 35) {
    return 'LOW';
  }

  if (score < 65) {
    return 'MODERATE';
  }

  if (score < 85) {
    return 'HIGH';
  }

  return 'CRITICAL';
}

function toNumber(value: NumericLike | null | undefined): number | null {
  return value === null || value === undefined ? null : Number(value.toString());
}

function roundMetric(value: number): number {
  return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}
