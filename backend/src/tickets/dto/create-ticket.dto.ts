import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TicketPriority, TicketStatus } from '../entities/ticket.entity';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Title of the ticket',
    example: 'Deploy Prometheus alert manager to production',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(120)
  title: string;

  @ApiProperty({
    description: 'Detailed description of the operational task or issue',
    example: 'Configure alertmanager webhook integration with Slack for critical alerts.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
    example: TicketPriority.HIGH,
  })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiPropertyOptional({
    enum: TicketStatus,
    default: TicketStatus.OPEN,
    example: TicketStatus.OPEN,
  })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @ApiPropertyOptional({
    description: 'Email or username of the assigned engineer',
    example: 'devops-oncall@example.com',
  })
  @IsString()
  @IsOptional()
  assignee?: string;
}