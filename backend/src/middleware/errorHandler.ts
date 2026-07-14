import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { env } from '../config/env.js';
import { errorResponse } from '../utils/apiResponse.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  void next;

  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json(errorResponse('BAD_REQUEST', 'Invalid JSON request body.'));
    return;
  }

  if (error instanceof ZodError) {
    res
      .status(422)
      .json(errorResponse('VALIDATION_ERROR', 'One or more fields are invalid.', error.flatten()));
    return;
  }

  if (env.NODE_ENV !== 'test') {
    console.error(error);
  }

  res.status(500).json(errorResponse('INTERNAL_ERROR', 'An unexpected server error occurred.'));
};
