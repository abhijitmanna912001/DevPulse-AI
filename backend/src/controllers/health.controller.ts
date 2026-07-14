import type { RequestHandler } from 'express';

import { getHealthStatus } from '../services/health.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getHealth: RequestHandler = (_req, res) => {
  res.status(200).json(successResponse(getHealthStatus()));
};
