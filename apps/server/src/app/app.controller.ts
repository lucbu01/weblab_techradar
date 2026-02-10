import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from './auth/auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Auth('CTO', 'TECHLEAD', 'EMPLOYEE')
  getData() {
    return this.appService.getData();
  }
}
