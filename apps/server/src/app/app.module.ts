import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentModule } from './environment/environment.module';
import { TechnologyModule } from './technology/technology.module';

@Module({
  imports: [
    AuthModule,
    EnvironmentModule,
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      autoCreate: true,
      dbName: process.env.MONGODB_DATABASE,
    }),
    TechnologyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
