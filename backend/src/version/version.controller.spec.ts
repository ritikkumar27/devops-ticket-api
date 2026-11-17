import { VersionController } from './version.controller.js';

describe('VersionController', () => {
  let controller: VersionController;

  beforeEach(() => {
    controller = new VersionController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return release version metadata', () => {
    const version = controller.getVersion();
    expect(version).toHaveProperty('name', 'devops-ticket-manager-api');
    expect(version).toHaveProperty('version');
    expect(version).toHaveProperty('commitSha');
    expect(version).toHaveProperty('environment');
    expect(version).toHaveProperty('deployedAt');
  });
});