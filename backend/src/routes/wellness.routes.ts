import { Router } from 'express';

import { saveDailyCheckInController } from '../controllers/wellness.controller.js';

export const wellnessRouter = Router();

wellnessRouter.post('/entries', saveDailyCheckInController);
