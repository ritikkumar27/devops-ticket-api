import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket, TicketPriority, TicketStatus } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  private tickets: Map<string, Ticket> = new Map();

  constructor() {
    this.seedInitialTickets();
  }

  private seedInitialTickets(): void {
    const initialTickets: Array<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>> = [
      {
        title: 'Configure automated DB backup on AWS RDS',
        description: 'Set retention policy to 14 days and test snapshot restore procedure.',
        priority: TicketPriority.HIGH,
        status: TicketStatus.IN_PROGRESS,
        assignee: 'sre-team@company.internal',
      },
      {
        title: 'Review container vulnerability scan report (Trivy)',
        description: 'Audit base images and patch high/critical CVEs in production services.',
        priority: TicketPriority.CRITICAL,
        status: TicketStatus.OPEN,
        assignee: 'security-lead@company.internal',
      },
      {
        title: 'Enable Nginx gzip compression and HTTP/2',
        description: 'Optimize edge proxy latency for static assets and API payloads.',
        priority: TicketPriority.LOW,
        status: TicketStatus.RESOLVED,
        assignee: 'platform-eng@company.internal',
      },
    ];

    for (const t of initialTickets) {
      const id = uuidv4();
      const now = new Date();
      this.tickets.set(id, {
        id,
        ...t,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  create(createTicketDto: CreateTicketDto): Ticket {
    const id = uuidv4();
    const now = new Date();
    const ticket: Ticket = {
      id,
      title: createTicketDto.title,
      description: createTicketDto.description,
      priority: createTicketDto.priority ?? TicketPriority.MEDIUM,
      status: createTicketDto.status ?? TicketStatus.OPEN,
      assignee: createTicketDto.assignee,
      createdAt: now,
      updatedAt: now,
    };

    this.tickets.set(id, ticket);
    return ticket;
  }

  findAll(filters?: { status?: TicketStatus; priority?: TicketPriority }): Ticket[] {
    let results = Array.from(this.tickets.values());

    if (filters?.status) {
      results = results.filter((t) => t.status === filters.status);
    }
    if (filters?.priority) {
      results = results.filter((t) => t.priority === filters.priority);
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  findOne(id: string): Ticket {
    const ticket = this.tickets.get(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID "${id}" was not found.`);
    }
    return ticket;
  }

  update(id: string, updateTicketDto: UpdateTicketDto): Ticket {
    const existing = this.findOne(id);
    const updated: Ticket = {
      ...existing,
      ...updateTicketDto,
      updatedAt: new Date(),
    };

    this.tickets.set(id, updated);
    return updated;
  }

  remove(id: string): { success: boolean; message: string } {
    this.findOne(id);
    this.tickets.delete(id);
    return {
      success: true,
      message: `Ticket "${id}" has been deleted successfully.`,
    };
  }

  getMetrics() {
    const total = this.tickets.size;
    const byStatus = {
      [TicketStatus.OPEN]: 0,
      [TicketStatus.IN_PROGRESS]: 0,
      [TicketStatus.RESOLVED]: 0,
      [TicketStatus.CLOSED]: 0,
    };

    for (const t of this.tickets.values()) {
      byStatus[t.status]++;
    }

    return { total, byStatus };
  }
}