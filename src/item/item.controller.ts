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

  @UseGuards(JwtAuthGuard)
  @Post('/publish/:id')
  async publishItem(
    @Param() params: IdDto,
    @Request() req,
  ): Promise<ResponseObject<Item>> {
    await this.itemService.updateOne(
      { _id: params.id, user: req.auth.user, timeWindow: { $gte: new Date() } },
      { status: StatusEnum.ongoing },
      {},
      'TIME_WINDOW_EXPIRED',
    );
    return new ResponseObject('ITEM_PUBLISHED');
  }

  // bid on an item

  @UseGuards(JwtAuthGuard)
  @Post('/bid/:id')
  async bidOnItem(
    @Body() bid: PriceDto,
    @Param() params: IdDto,
    @Request() req,
  ): Promise<ResponseObject<Item>> {
    console.log(params.id);
    const data = await this.itemService.bidOnItem(
      params.id,
      req.auth.user,
      bid,
    );
    return new ResponseObject('ITEM_BID', data);
  }
}
