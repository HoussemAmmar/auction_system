import { Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '../abstract/abstract.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Item } from './item.schema';

@Injectable()
export class ItemService extends AbstractService<Item> {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super(itemModel, logger);
  }
  protected modelName = Item.name;
}
