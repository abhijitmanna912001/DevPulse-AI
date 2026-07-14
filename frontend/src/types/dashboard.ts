export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type TrendDirection = 'UP' | 'DOWN' | 'FLAT';

export type DashboardResponse = {
  success: true;
  data: DashboardData;
  meta: {
    windowDays: number;
    computedAt: string;
  };
};

export type DashboardData = {
  demoUser: {
    displayName: string;
    role: string | null;
  };
  latestEntry: WellnessEntry | null;
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

export type WellnessEntry = {
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
