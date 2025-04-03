import { Controller, Get } from '@nestjs/common';
import { ClockService } from './clock.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('clock')
@Controller('clock')
export class ClockController {
  constructor(private readonly clockService: ClockService) {}

  @ApiOperation({ summary: 'Get current server time' })
  @ApiResponse({
    status: 200,
    description: 'Current server time',
    schema: {
      type: 'object',
      properties: {
        time: {
          type: 'string',
          example: '2025-04-03T15:30:45.123Z',
          description: 'Current ISO timestamp',
        },
      },
    },
  })
  @Get()
  getTime() {
    return this.clockService.getTime();
  }
}
