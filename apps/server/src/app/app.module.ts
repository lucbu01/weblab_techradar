import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EnvironmentController } from './environment.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController, EnvironmentController],
  providers: [AppService],
})
export class AppModule {}
