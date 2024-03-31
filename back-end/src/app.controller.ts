import { Controller, Get, Options } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
 
  @Options('/*')
  handleOptions() {
    return 'OK';
  }
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
