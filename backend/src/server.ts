import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.log(`DevPulse AI API foundation listening on port ${env.PORT}`);
});
