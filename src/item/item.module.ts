import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './item.schema';
import { BullModule } from '@nestjs/bull';
import { ItemConsumer } from './item.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    BullModule.registerQueue({
      name: 'item-queue',
    }),
  ],
  controllers: [ItemController],
  providers: [ItemService, ItemConsumer],
})
export class ItemModule {}
