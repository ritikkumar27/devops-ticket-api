import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export class Ticket {
  @ApiProperty({ example: 'b6f4a860-84cf-4a11-8a6a-72ef8c1d5731' })
  id: string;

  @ApiProperty({ example: 'Fix high memory leak on production worker' })
  title: string;

  @ApiProperty({ example: 'Worker container crashes every 2 hours under high queue load.' })
  description: string;

  @ApiProperty({ enum: TicketPriority, example: TicketPriority.HIGH })
  priority: TicketPriority;

  @ApiProperty({ enum: TicketStatus, example: TicketStatus.OPEN })
  status: TicketStatus;

  @ApiPropertyOptional({ example: 'devops-lead@company.internal' })
  assignee?: string;

  @ApiProperty({ example: '2026-11-17T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-11-17T12:00:00.000Z' })
  updatedAt: Date;
}