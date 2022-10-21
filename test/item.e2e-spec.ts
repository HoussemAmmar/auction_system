import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
// import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { JwtAuthGuard } from '../src/guards/jwt-auth.guard';
import { ItemService } from '../src/item/item.service';
import { ItemModule } from '../src/item/item.module';
// import { ItemController } from '../src/item/item.controller';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';
import { AuthModule } from '../src/auth/auth.module';
import { UserModule } from '../src/user/user.module';
import { ExecutionContext, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Types } from 'mongoose';
import * as request from 'supertest';

describe('Auction system: bid on an item  (e2e)', () => {
  let app: any;
  let itemService: ItemService;
  const id = '63528874632bc75ac5b59540';
  const user = new Types.ObjectId('6351d04551267afcf544afe2');
  let jwtToken;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './test/.env.test',
        }),
        MongooseModule.forRoot(process.env.MONGO_URL, {
          useUnifiedTopology: true,
          minPoolSize: 20,
          maxPoolSize: 200,
        }),
        BullModule.forRoot({
          redis: {
            host: process.env.BULL_REDIS_HOST,
            port: parseInt(process.env.BULL_REDIS_PORT),
            password: process.env.BULL_REDIS_PASSWORD,
          },
        }),
        JwtModule.register({
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          secretOrPrivateKey: process.env.JWT_ACCESS_TOKEN_SECRET,
          signOptions: { expiresIn: '24h' },
        }),
        WinstonModule.forRoot({
          handleExceptions: true,
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.ms(),
                winston.format.timestamp(),
                winston.format.json(),
                nestWinstonModuleUtilities.format.nestLike('AUCTION-API', {
                  prettyPrint: true,
                }),
                winston.format.align(),
                winston.format.colorize({ all: true }),
              ),
            }),
          ],
        }),

        AuthModule,
        UserModule,
        ItemModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.auth = { user: user };
          req.user = { user: user };
          return true;
        },
      })
      .compile();

    itemService = moduleRef.get<ItemService>(ItemService);

    app = await NestFactory.create(AppModule);
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close().then();
  });

  it('Login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'houssem.ammar.06@gmail.com',
        password: '123456',
      })
      .expect(201);
    jwtToken = response.body.data.access_token;
    expect(response.body.message).toEqual('LOGIN_SUCCEEDED');
  });

  it('Add a valid bid', async () => {
    const response = await request(app.getHttpServer())
      .post(`/item/bid/${id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        amount: 8000,
        currency: 'usd',
      })
      .expect(201);
    expect(response.body.message).toEqual('ITEM_BID');
    const _id = new Types.ObjectId(id);
    const item = await itemService.findById(_id);
    expect(item.bids.length).toBeGreaterThanOrEqual(1);
  });

  it('Add a bid with the same price', async () => {
    const response = await request(app.getHttpServer())
      .post(`/item/bid/${id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        amount: 8000,
        currency: 'usd',
      })
      .expect(403);
    expect(response.body.message).toEqual('You must bid with a higher price');
  });

  it("Bid on an item that hasn't been published yet", async () => {
    const response = await request(app.getHttpServer())
      .post('/item/bid/6352aed71d9924910db7ff9d')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        amount: 7000,
        currency: 'usd',
      })
      .expect(403);
    expect(response.body.message).toEqual(
      "You cannot bid on item ,it's not yet published",
    );
  });
  it('Bid is over ( time window)', async () => {
    const response = await request(app.getHttpServer())
      .post('/item/bid/6352b0a7f32192be89da2ffb')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        amount: 7000,
        currency: 'usd',
      })
      .expect(403);
    expect(response.body.message).toEqual('Bid is over');
  });

  it('Clean database ( time window)', async () => {
    const _id = new Types.ObjectId(id);
    const item = await itemService.findById(_id);
    await itemService.updateOne(
      { _id },
      { highestPrice: item.startedPrice, bids: [] },
    );
  });
});
