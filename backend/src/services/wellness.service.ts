import { env } from '../config/env.js';
import { prisma } from '../db/prisma.js';
import { getDashboardData } from './dashboard.service.js';

export type UpsertWellnessEntryInput = {
  entryDate: string;
  sleepHours: number;
  sleepQuality?: number;
  steps: number;
  exerciseMinutes?: number;
  moodScore: number;
  energyScore: number;
  workHours: number;
  codingMinutes: number;
  breakCount: number;
  notes?: string;
};

export async function saveDailyCheckIn(input: UpsertWellnessEntryInput) {
  const demoUser = await prisma.user.findFirst({
    where: {
      OR: [{ id: env.DEMO_USER_ID }, { demoKey: 'default-demo-user' }],
    },
    select: {
      id: true,
    },
  });

  if (!demoUser) {
    throw new Error('Demo User has not been seeded.');
  }

  await prisma.wellnessEntry.upsert({
    where: {
      userId_entryDate: {
        userId: demoUser.id,
        entryDate: toEntryDate(input.entryDate),
      },
    },
    update: {
      sleepHours: input.sleepHours,
      sleepQuality: input.sleepQuality,
      steps: input.steps,
      exerciseMinutes: input.exerciseMinutes,
      moodScore: input.moodScore,
      energyScore: input.energyScore,
      workHours: input.workHours,
      codingMinutes: input.codingMinutes,
      breakCount: input.breakCount,
      notes: input.notes,
    },
    create: {
      userId: demoUser.id,
      entryDate: toEntryDate(input.entryDate),
      sleepHours: input.sleepHours,
      sleepQuality: input.sleepQuality,
      steps: input.steps,
      exerciseMinutes: input.exerciseMinutes,
      moodScore: input.moodScore,
      energyScore: input.energyScore,
      workHours: input.workHours,
      codingMinutes: input.codingMinutes,
      breakCount: input.breakCount,
      notes: input.notes,
    },
  });

  return getDashboardData({ windowDays: 7 });
}

function toEntryDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}
