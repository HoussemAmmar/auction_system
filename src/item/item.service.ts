import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '../abstract/abstract.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Item } from './item.schema';
import { CreateItemDto, PriceDto } from './item.dto';
import { StatusEnum } from '../types/item.types';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ItemService extends AbstractService<Item> {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectQueue('item') private itemQueue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super(itemModel, logger);
  }
  protected modelName = Item.name;

  async createItem(user: Types.ObjectId, item: CreateItemDto): Promise<Item> {
    if (new Date().getTime() >= new Date(item.timeWindow).getTime()) {
      throw new ForbiddenException('Time window cannot be in the past');
    }
    const data = await this.create({
      ...item,
      user,
      highestPrice: item.startedPrice,
      status: StatusEnum.drafted,
    });
    const timeToChangeStatus =
      new Date(item.timeWindow).getTime() - new Date().getTime();

    console.log(timeToChangeStatus);
    await this.itemQueue.add(
      'status-completed',
      {
        _id: data._id,
      },
      {
        removeOnComplete: true,
        attempts: 3,
        delay: timeToChangeStatus,
      },
    );

    return data;
  }

  async bidOnItem(
    id: Types.ObjectId,
    user: Types.ObjectId,
    bid: PriceDto,
  ): Promise<Item> {
    const item = await this.findById(id, {
      name: 1,
      user: 1,
      startedPrice: 1,
      highestPrice: 1,
      status: 1,
      timeWindow: 1,
      createdAt: 1,
      updatedAt: 1,
      bids: {
        $filter: {
          input: '$bids',
          as: 'bids',
          cond: {
            $eq: ['$$bids.user', new Types.ObjectId(user)],
          },
        },
      },
    });

    if (item.status === StatusEnum.drafted) {
      throw new ForbiddenException(
        "You cannot bid on item ,it's not yet published",
      );
    }

    if (new Date().getTime() >= item.timeWindow.getTime()) {
      throw new ForbiddenException('Bid is over');
    }
    // for now we only have one currency
    if (item.highestPrice.amount >= bid.amount) {
      throw new ForbiddenException('You must bid with a higher price');
    }

    const lastUserBid = item.bids.pop();
    const timeBidDifference =
      (new Date().getTime() -
        (lastUserBid ? lastUserBid.createdAt.getTime() : 0)) /
      1000;

    if (timeBidDifference < 5 && item.bids.length > 0) {
      throw new ForbiddenException('Bid again after 5 seconds');
    }

    return await this.findByIdAndUpdate(id, {
      highestPrice: bid,
      $push: { bids: { user, bidPrice: bid } },
    });
  }
}
