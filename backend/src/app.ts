import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFound.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiRouter } from './routes/index.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
  }),
);
app.use(express.json());
app.use(requestLogger);

app.use('/api/v1', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
