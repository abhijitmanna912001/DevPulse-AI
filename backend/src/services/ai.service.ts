import { randomUUID } from 'node:crypto';

import OpenAI from 'openai';

import { env } from '../config/env.js';
import { getDashboardData } from './dashboard.service.js';

export class AiUnavailableError extends Error {
  constructor(message = 'AI provider is unavailable.') {
    super(message);
    this.name = 'AiUnavailableError';
  }
}

export type AiChatResult = {
  conversationId: string;
  userMessage: {
    id: string;
    role: 'USER';
    content: string;
    createdAt: string;
  };
  assistantMessage: {
    id: string;
    role: 'ASSISTANT';
    content: string;
    createdAt: string;
  };
  contextMetadata: {
    windowDays: 7;
    recoveryScore: number;
    burnoutRiskScore: number;
    riskLevel: string;
    usedRawHistory: false;
  };
};

export async function askAiCoach(message: string): Promise<AiChatResult> {
  if (!env.OPENAI_API_KEY?.trim()) {
    throw new AiUnavailableError('OPENAI_API_KEY is not configured.');
  }

  const dashboard = await getDashboardData({ windowDays: 7 });
  const context = {
    recoveryScore: dashboard.scores.recoveryScore,
    burnoutRiskScore: dashboard.scores.burnoutRiskScore,
    riskLevel: dashboard.scores.riskLevel,
    latestWellnessEntry: dashboard.latestEntry
      ? {
          entryDate: dashboard.latestEntry.entryDate,
          sleepHours: dashboard.latestEntry.sleepHours,
          moodScore: dashboard.latestEntry.moodScore,
          energyScore: dashboard.latestEntry.energyScore,
          workHours: dashboard.latestEntry.workHours,
          codingMinutes: dashboard.latestEntry.codingMinutes,
          steps: dashboard.latestEntry.steps,
          breakCount: dashboard.latestEntry.breakCount,
        }
      : null,
    latestInsight: dashboard.latestInsight
      ? {
          period: dashboard.latestInsight.period,
          summary: dashboard.latestInsight.summary,
          recommendedAction: dashboard.latestInsight.recommendedAction,
        }
      : null,
  };

  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  try {
    const response = await client.responses.create({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: 'system',
          content:
            'You are DevPulse AI, a developer wellness coach. Explain backend-calculated wellness data in a practical, non-medical way. Do not diagnose medical conditions. Do not calculate or alter risk scores. Keep answers concise and actionable.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            userQuestion: message,
            summarizedContext: context,
          }),
        },
      ],
    });

    const content = response.output_text?.trim();

    if (!content) {
      throw new AiUnavailableError('OpenAI returned an empty response.');
    }

    return {
      conversationId: randomUUID(),
      userMessage: {
        id: randomUUID(),
        role: 'USER',
        content: message,
        createdAt: new Date().toISOString(),
      },
      assistantMessage: {
        id: randomUUID(),
        role: 'ASSISTANT',
        content,
        createdAt: new Date().toISOString(),
      },
      contextMetadata: {
        windowDays: 7,
        recoveryScore: dashboard.scores.recoveryScore,
        burnoutRiskScore: dashboard.scores.burnoutRiskScore,
        riskLevel: dashboard.scores.riskLevel,
        usedRawHistory: false,
      },
    };
  } catch (error) {
    if (error instanceof AiUnavailableError) {
      throw error;
    }

    throw new AiUnavailableError();
  }
}
