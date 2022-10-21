import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '../abstract/abstract.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Item } from './item.schema';
import { PriceDto } from './item.dto';
import { StatusEnum } from '../types/item.types';

@Injectable()
export class ItemService extends AbstractService<Item> {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super(itemModel, logger);
  }
  protected modelName = Item.name;

  async bidOnItem(id: Types.ObjectId, user: Types.ObjectId, bid: PriceDto) {
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
