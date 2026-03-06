import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentModule } from './environment/environment.module';
import { TechnologyModule } from './technology/technology.module';
import { AuditModule } from './audit/audit.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'browser'),
      exclude: ['/api', '/api/{*any}'],
      serveStaticOptions: {
        index: false,
      },
    }),
    AuthModule,
    EnvironmentModule,
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      autoCreate: true,
      dbName: process.env.MONGODB_DATABASE,
      retryAttempts: 5,
      retryDelay: 1000,
      connectTimeoutMS: 10000,
    }),
    AuditModule,
    TechnologyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
