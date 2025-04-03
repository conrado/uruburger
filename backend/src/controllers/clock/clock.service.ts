import { Injectable } from '@nestjs/common';

@Injectable()
export class ClockService {
  getTime(): { time: string; timestamp: number } {
    const now = new Date();
    return {
      time: now.toISOString(),
      timestamp: now.getTime(),
    };
  }
}
