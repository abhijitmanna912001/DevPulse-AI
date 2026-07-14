import { env } from '../src/config/env.js';
import { prisma } from '../src/db/prisma.js';

const demoUserId = env.DEMO_USER_ID;
const demoKey = 'default-demo-user';

function day(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

async function main() {
  const user = await prisma.user.upsert({
    where: { demoKey },
    update: {
      displayName: 'Demo Developer',
    },
    create: {
      id: demoUserId,
      displayName: 'Demo Developer',
      demoKey,
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {
      role: 'SOFTWARE_ENGINEER',
      typicalWorkSchedule: 'Hybrid developer schedule with focused coding blocks on weekdays.',
      wellnessGoals:
        'Improve sleep consistency, reduce late-night coding, and add movement breaks.',
      preferredSleepHours: '7.50',
      preferredDailySteps: 8000,
    },
    create: {
      userId: user.id,
      role: 'SOFTWARE_ENGINEER',
      typicalWorkSchedule: 'Hybrid developer schedule with focused coding blocks on weekdays.',
      wellnessGoals:
        'Improve sleep consistency, reduce late-night coding, and add movement breaks.',
      preferredSleepHours: '7.50',
      preferredDailySteps: 8000,
    },
  });

  await prisma.aiConversation.deleteMany({
    where: { userId: user.id },
  });
  await prisma.insightSnapshot.deleteMany({
    where: { userId: user.id },
  });
  await prisma.wellnessEntry.deleteMany({
    where: { userId: user.id },
  });

  await prisma.wellnessEntry.createMany({
    data: [
      {
        userId: user.id,
        entryDate: day('2026-07-01'),
        sleepHours: '6.80',
        sleepQuality: 3,
        steps: 5200,
        exerciseMinutes: 15,
        moodScore: 3,
        energyScore: 3,
        workHours: '8.50',
        codingMinutes: 320,
        breakCount: 4,
        notes: 'Steady feature work with a slightly late finish.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-02'),
        sleepHours: '6.20',
        sleepQuality: 3,
        steps: 4100,
        exerciseMinutes: 10,
        moodScore: 3,
        energyScore: 2,
        workHours: '9.50',
        codingMinutes: 390,
        breakCount: 3,
        notes: 'Long review cycle and fewer breaks than planned.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-03'),
        sleepHours: '5.60',
        sleepQuality: 2,
        steps: 3200,
        exerciseMinutes: 0,
        moodScore: 2,
        energyScore: 2,
        workHours: '10.50',
        codingMinutes: 480,
        breakCount: 2,
        notes: 'Deadline push with late-night debugging.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-04'),
        sleepHours: '8.10',
        sleepQuality: 4,
        steps: 8200,
        exerciseMinutes: 45,
        moodScore: 4,
        energyScore: 4,
        workHours: '2.00',
        codingMinutes: 60,
        breakCount: 5,
        notes: 'Weekend recovery day with a short maintenance task.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-05'),
        sleepHours: '8.40',
        sleepQuality: 5,
        steps: 9000,
        exerciseMinutes: 50,
        moodScore: 5,
        energyScore: 5,
        workHours: '1.00',
        codingMinutes: 30,
        breakCount: 6,
        notes: 'Restful Sunday with strong activity and minimal work.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-06'),
        sleepHours: '7.00',
        sleepQuality: 4,
        steps: 6500,
        exerciseMinutes: 25,
        moodScore: 4,
        energyScore: 4,
        workHours: '8.00',
        codingMinutes: 300,
        breakCount: 5,
        notes: 'Balanced Monday with planned breaks.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-07'),
        sleepHours: '6.40',
        sleepQuality: 3,
        steps: 4800,
        exerciseMinutes: 15,
        moodScore: 3,
        energyScore: 3,
        workHours: '9.00',
        codingMinutes: 360,
        breakCount: 3,
        notes: 'Higher workload and moderate recovery.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-08'),
        sleepHours: '5.90',
        sleepQuality: 2,
        steps: 3900,
        exerciseMinutes: 0,
        moodScore: 2,
        energyScore: 2,
        workHours: '10.00',
        codingMinutes: 450,
        breakCount: 2,
        notes: 'Intense coding block after poor sleep.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-09'),
        sleepHours: '6.10',
        sleepQuality: 3,
        steps: 4400,
        exerciseMinutes: 10,
        moodScore: 3,
        energyScore: 2,
        workHours: '9.50',
        codingMinutes: 420,
        breakCount: 3,
        notes: 'Sustained workload with low movement.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-10'),
        sleepHours: '5.30',
        sleepQuality: 2,
        steps: 2800,
        exerciseMinutes: 0,
        moodScore: 2,
        energyScore: 1,
        workHours: '11.00',
        codingMinutes: 520,
        breakCount: 1,
        notes: 'Peak deadline pressure and very low recovery.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-11'),
        sleepHours: '7.80',
        sleepQuality: 4,
        steps: 7600,
        exerciseMinutes: 40,
        moodScore: 4,
        energyScore: 4,
        workHours: '2.50',
        codingMinutes: 90,
        breakCount: 5,
        notes: 'Weekend reset with exercise and light coding.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-12'),
        sleepHours: '8.60',
        sleepQuality: 5,
        steps: 9800,
        exerciseMinutes: 55,
        moodScore: 5,
        energyScore: 5,
        workHours: '1.00',
        codingMinutes: 25,
        breakCount: 7,
        notes: 'Best recovery day of the two-week window.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-13'),
        sleepHours: '6.70',
        sleepQuality: 3,
        steps: 5200,
        exerciseMinutes: 20,
        moodScore: 3,
        energyScore: 3,
        workHours: '8.50',
        codingMinutes: 330,
        breakCount: 4,
        notes: 'Returned to normal workload after weekend recovery.',
      },
      {
        userId: user.id,
        entryDate: day('2026-07-14'),
        sleepHours: '6.00',
        sleepQuality: 3,
        steps: 4300,
        exerciseMinutes: 15,
        moodScore: 3,
        energyScore: 2,
        workHours: '9.75',
        codingMinutes: 390,
        breakCount: 3,
        notes: 'Lower recovery after a longer coding-heavy day.',
      },
    ],
  });

  await prisma.insightSnapshot.createMany({
    data: [
      {
        userId: user.id,
        period: 'WEEKLY',
        periodStart: day('2026-07-01'),
        periodEnd: day('2026-07-07'),
        recoveryScore: 70,
        burnoutRiskScore: 38,
        riskLevel: 'MODERATE',
        summary:
          'Your first week shows a midweek strain from deadline work, followed by strong weekend recovery. Sleep and movement helped bring recovery back up before Monday.',
        recommendedAction:
          'Protect the weekend recovery pattern and add one more movement break on heavier weekdays.',
      },
      {
        userId: user.id,
        period: 'WEEKLY',
        periodStart: day('2026-07-08'),
        periodEnd: day('2026-07-14'),
        recoveryScore: 62,
        burnoutRiskScore: 50,
        riskLevel: 'MODERATE',
        summary:
          'This week includes a sharper workload spike, especially around Friday, with recovery improving over the weekend and dipping again after Monday work resumed.',
        recommendedAction:
          'Keep coding blocks shorter tomorrow and schedule a walk before the second deep-work session.',
      },
      {
        userId: user.id,
        period: 'DAILY',
        periodStart: day('2026-07-14'),
        periodEnd: day('2026-07-14'),
        recoveryScore: 60,
        burnoutRiskScore: 52,
        riskLevel: 'MODERATE',
        summary:
          'Your recovery is lower today because sleep was below target and coding time stayed high. The risk is moderate, not critical, but your body is signaling that recovery should be prioritized.',
        recommendedAction:
          'Take two short movement breaks, avoid late-night coding, and aim for at least 7.5 hours of sleep tonight.',
      },
    ],
  });

  console.log(`Seeded Demo User ${user.id} with 14 wellness entries and 3 insight snapshots.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
