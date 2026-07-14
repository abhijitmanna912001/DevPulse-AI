import type { RequestHandler } from 'express';
import { z } from 'zod';

import { AiUnavailableError, askAiCoach } from '../services/ai.service.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

const aiChatSchema = z.object({
  message: z.string().trim().min(1, 'message is required').max(1000),
});

export const postAiChat: RequestHandler = async (req, res, next) => {
  try {
    const { message } = aiChatSchema.parse(req.body);
    const data = await askAiCoach(message);

    res.status(200).json(
      successResponse(data, {
        openAiCalled: true,
        fallbackUsed: false,
      }),
    );
  } catch (error) {
    if (error instanceof AiUnavailableError) {
      res.status(503).json(errorResponse('AI_UNAVAILABLE', error.message));
      return;
    }

    next(error);
  }
};
