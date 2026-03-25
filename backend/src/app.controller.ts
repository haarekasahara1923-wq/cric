import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Cricbuzz API is running 🚀. Please go to /api/v1/... for API endpoints.';
  }
}
