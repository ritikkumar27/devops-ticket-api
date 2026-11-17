import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return alive status for liveness probe', () => {
    const res = controller.liveness();
    expect(res.status).toBe('alive');
    expect(res.timestamp).toBeDefined();
  });

  it('should return ready status for readiness probe', () => {
    const res = controller.readiness();
    expect(res.status).toBe('ready');
    expect(res.timestamp).toBeDefined();
  });

  it('should return comprehensive system health report', () => {
    const report = controller.check();
    expect(report.status).toBe('ok');
    expect(report.service).toBe('devops-ticket-manager-api');
    expect(report.system).toBeDefined();
    expect(report.system.memory).toHaveProperty('heapUsedMb');
  });
});