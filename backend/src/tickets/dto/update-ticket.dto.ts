import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TicketPriority, TicketStatus } from '../entities/ticket.entity.js';

export class UpdateTicketDto {
  @ApiPropertyOptional({
    description: 'Updated title',
    example: 'Deploy Prometheus alert manager with PagerDuty webhook',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated description',
  })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    enum: TicketPriority,
  })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiPropertyOptional({
    enum: TicketStatus,
    example: TicketStatus.RESOLVED,
  })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @ApiPropertyOptional({
    description: 'Assignee username or email',
  })
  @IsString()
  @IsOptional()
  assignee?: string;
}