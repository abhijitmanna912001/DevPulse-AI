export type HealthStatus = {
  status: 'ok';
  service: 'DevPulse AI API';
  version: 'v1';
};

export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    service: 'DevPulse AI API',
    version: 'v1',
  };
}
