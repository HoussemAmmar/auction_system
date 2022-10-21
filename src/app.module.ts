import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
// import { validateEnv } from './env.validation';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemModule } from './item/item.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './guards/jwt.strategy';
import { BullModule } from '@nestjs/bull';

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
            nestWinstonModuleUtilities.format.nestLike('AUCTION-SYSTEM', {
              prettyPrint: true,
            }),
            winston.format.align(),
            winston.format.colorize({ all: true }),
          ),
        }),
      ],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.BULL_REDIS_HOST,
        port: parseInt(process.env.BULL_REDIS_PORT),
        password: process.env.BULL_REDIS_PASSWORD,
      },
    }),
    AuthModule,
    UserModule,
    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
