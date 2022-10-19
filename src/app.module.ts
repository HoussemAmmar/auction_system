import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
// import { validateEnv } from './env.validation';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      useUnifiedTopology: true,
      minPoolSize: 20,
      maxPoolSize: 200,
    }),
    WinstonModule.forRoot({
      handleExceptions: true,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.ms(),
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.align(),
            winston.format.colorize({ all: true }),
          ),
        }),
      ],
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
