import { Router } from 'express';

import { postAiChat } from '../controllers/ai.controller.js';

export const aiRouter = Router();

aiRouter.post('/chat', postAiChat);
