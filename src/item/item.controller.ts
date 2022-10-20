import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StatusEnum } from 'src/types/item.types';
import { CreateItemDto, IdDto, PriceDto } from './item.dto';
import { ItemService } from './item.service';
import { ResponseObject } from '../abstract/response.object';
import { Item } from './item.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Types } from 'mongoose';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createItem(
    @Body() item: CreateItemDto,
    @Request() req,
  ): Promise<ResponseObject<Item>> {
    const data = await this.itemService.create({
      ...item,
      user: req.auth.user,
      highestPrice: item.startedPrice,
      status: StatusEnum.drafted,
    });
    return new ResponseObject('ITEM_CREATED', data);
  }

  // bid on an item

  @UseGuards(JwtAuthGuard)
  @Post('/bid/:id')
  async bidOnItem(
    @Body() bid: PriceDto,
    @Param() params: IdDto,
  ): Promise<ResponseObject<Item>> {
    console.log(params.id);
    const user = new Types.ObjectId('635015011b4ccbb3b5a2c706');
    const data = await this.itemService.bidOnItem(params.id, user, bid);
    return new ResponseObject('ITEM_BID', data);
  }
}
