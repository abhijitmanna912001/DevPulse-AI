import { Router } from 'express';

import { aiRouter } from './ai.routes.js';
import { dashboardRouter } from './dashboard.routes.js';
import { healthRouter } from './health.routes.js';
import { insightsRouter } from './insights.routes.js';
import { wellnessRouter } from './wellness.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/wellness', wellnessRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/insights', insightsRouter);
