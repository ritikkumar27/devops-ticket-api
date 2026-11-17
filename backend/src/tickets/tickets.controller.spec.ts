import { Test, TestingModule } from '@nestjs/testing';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketPriority, TicketStatus } from './entities/ticket.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [TicketsService],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of tickets', () => {
    const result = controller.findAll();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should create a ticket through the controller', () => {
    const dto: CreateTicketDto = {
      title: 'Setup Grafana alert for disk usage',
      description: 'Notify when disk exceeds 85%',
      priority: TicketPriority.HIGH,
    };
    const created = controller.create(dto);
    expect(created.title).toBe(dto.title);
  });

  it('should get metrics', () => {
    const metrics = controller.getMetrics();
    expect(metrics).toHaveProperty('total');
    expect(metrics).toHaveProperty('byStatus');
  });

  it('should find one ticket', () => {
    const first = controller.findAll()[0];
    const found = controller.findOne(first.id);
    expect(found.id).toBe(first.id);
  });

  it('should update a ticket', () => {
    const first = controller.findAll()[0];
    const updated = controller.update(first.id, { status: TicketStatus.CLOSED });
    expect(updated.status).toBe(TicketStatus.CLOSED);
  });

  it('should delete a ticket', () => {
    const created = controller.create({
      title: 'Ticket to be removed',
      description: 'Testing remove controller endpoint',
    });
    const result = controller.remove(created.id);
    expect(result.success).toBe(true);
  });
});