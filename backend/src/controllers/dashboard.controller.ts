import type { RequestHandler } from 'express';

import { getDashboardData } from '../services/dashboard.service.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

export const getDashboard: RequestHandler = async (req, res, next) => {
  try {
    const windowDays = parseWindowDays(req.query.windowDays);

    if (windowDays === null) {
      res
        .status(400)
        .json(errorResponse('BAD_REQUEST', 'windowDays must be either 7 or 30 when provided.'));
      return;
    }

    const data = await getDashboardData({ windowDays });

    res.status(200).json(
      successResponse(data, {
        windowDays,
        computedAt: new Date().toISOString(),
      }),
    );
  } catch (error) {
    next(error);
  }
};

function parseWindowDays(value: unknown): 7 | 30 | null {
  if (value === undefined) {
    return 7;
  }

  if (Array.isArray(value)) {
    return null;
  }

  if (value === '7' || value === 7) {
    return 7;
  }

  if (value === '30' || value === 30) {
    return 30;
  }

  return null;
}
