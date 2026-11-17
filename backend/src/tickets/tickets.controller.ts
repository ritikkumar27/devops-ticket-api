import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket, TicketPriority, TicketStatus } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new DevOps/SRE ticket' })
  @ApiCreatedResponse({ description: 'The ticket has been successfully created.', type: Ticket })
  create(@Body() createTicketDto: CreateTicketDto): Ticket {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tickets with optional filtering' })
  @ApiQuery({ name: 'status', enum: TicketStatus, required: false })
  @ApiQuery({ name: 'priority', enum: TicketPriority, required: false })
  @ApiOkResponse({ description: 'List of tickets retrieved successfully.', type: [Ticket] })
  findAll(
    @Query('status') status?: TicketStatus,
    @Query('priority') priority?: TicketPriority,
  ): Ticket[] {
    return this.ticketsService.findAll({ status, priority });
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get ticket counts and status distribution metrics' })
  getMetrics() {
    return this.ticketsService.getMetrics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific ticket by ID' })
  @ApiOkResponse({ description: 'Ticket found.', type: Ticket })
  findOne(@Param('id') id: string): Ticket {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing ticket' })
  @ApiOkResponse({ description: 'Ticket updated successfully.', type: Ticket })
  update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ): Ticket {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a ticket by ID' })
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}