import { Body, Controller, Post } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { StatusEnum } from 'src/types/item.types';
import { CreateItemDto } from './item.dto';
import { ItemService } from './item.service';
import { ResponseObject } from '../abstract/response.object';
import { Item } from './item.schema';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post('')
  async createItem(@Body() item: CreateItemDto): Promise<ResponseObject<Item>> {
    const user = new ObjectId('635015011b4ccbb3b5a2c706');
    const data = await this.itemService.create({
      ...item,
      user,
      highestPrice : item.startedPrice,
      status: StatusEnum.drafted,
    });
    return new ResponseObject('ITem_UPDATED', data);
  }
}
