import type { RequestHandler } from 'express';
import { z } from 'zod';

import { saveDailyCheckIn } from '../services/wellness.service.js';
import { successResponse } from '../utils/apiResponse.js';

const dailyCheckInSchema = z.object({
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'entryDate must use YYYY-MM-DD format'),
  sleepHours: z.coerce.number().min(0).max(24),
  sleepQuality: z.coerce.number().int().min(1).max(5).optional(),
  steps: z.coerce.number().int().min(0),
  exerciseMinutes: z.coerce.number().int().min(0).optional(),
  moodScore: z.coerce.number().int().min(1).max(5),
  energyScore: z.coerce.number().int().min(1).max(5),
  workHours: z.coerce.number().min(0).max(24),
  codingMinutes: z.coerce.number().int().min(0),
  breakCount: z.coerce.number().int().min(0),
  notes: z.string().trim().max(500).optional(),
});

export const saveDailyCheckInController: RequestHandler = async (req, res, next) => {
  try {
    const input = dailyCheckInSchema.parse(req.body);
    const dashboard = await saveDailyCheckIn(input);

    res.status(200).json(
      successResponse(dashboard, {
        windowDays: 7,
        computedAt: new Date().toISOString(),
      }),
    );
  } catch (error) {
    next(error);
  }
};
