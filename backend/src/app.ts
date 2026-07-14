import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
  }),
);
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'No API routes have been implemented yet.',
    },
  });
});
