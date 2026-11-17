import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { TicketPriority, TicketStatus } from './entities/ticket.entity.js';
import { TicketsService } from './tickets.service.js';

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsService],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have initial seeded tickets', () => {
    const tickets = service.findAll();
    expect(tickets.length).toBeGreaterThanOrEqual(3);
  });

  it('should create a new ticket successfully', () => {
    const dto: CreateTicketDto = {
      title: 'Upgrade Kubernetes ingress-nginx to v1.9',
      description: 'Apply security patch to mitigate CVE-2023-5044',
      priority: TicketPriority.CRITICAL,
      status: TicketStatus.OPEN,
      assignee: 'security@example.com',
    };

    const created = service.create(dto);
    expect(created.id).toBeDefined();
    expect(created.title).toBe(dto.title);
    expect(created.priority).toBe(TicketPriority.CRITICAL);
    expect(created.status).toBe(TicketStatus.OPEN);
  });

  it('should retrieve a ticket by ID', () => {
    const all = service.findAll();
    const first = all[0];
    const retrieved = service.findOne(first.id);
    expect(retrieved.id).toBe(first.id);
    expect(retrieved.title).toBe(first.title);
  });

  it('should throw NotFoundException for non-existent ticket ID', () => {
    expect(() => service.findOne('non-existent-uuid')).toThrow(NotFoundException);
  });

  it('should update a ticket status and properties', () => {
    const all = service.findAll();
    const target = all[0];
    const updated = service.update(target.id, {
      status: TicketStatus.RESOLVED,
      title: 'Updated title for ticket',
    });

    expect(updated.status).toBe(TicketStatus.RESOLVED);
    expect(updated.title).toBe('Updated title for ticket');
  });

  it('should delete a ticket successfully', () => {
    const created = service.create({
      title: 'Temporary ticket to delete',
      description: 'Testing deletion logic',
    });

    const res = service.remove(created.id);
    expect(res.success).toBe(true);
    expect(() => service.findOne(created.id)).toThrow(NotFoundException);
  });

  it('should compute metrics correctly', () => {
    const metrics = service.getMetrics();
    expect(metrics.total).toBeGreaterThan(0);
    expect(metrics.byStatus).toHaveProperty(TicketStatus.OPEN);
  });
});