import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StatusEnum } from '../types/item.types';
import { CreateItemDto, FilterItems, IdDto, PriceDto } from './item.dto';
import { ItemService } from './item.service';
import { ResponseObject } from '../abstract/response.object';
import { Item } from './item.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('item')
@ApiTags('Item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getOngoingCompletedItems(
    @Query() filterItems: FilterItems,
  ): Promise<ResponseObject<Item[]>> {
    const data = await this.itemService.find(
      {
        status: { $ne: StatusEnum.drafted },
      },
      null,
      {
        skip: filterItems.skip,
        limit: filterItems.limit,
      },
      {
        createdAt: filterItems?.latest,
      },
    );
    return new ResponseObject('ITEMS_FOUND', data);
  }

  // for guests
  @Get('completed-items')
  async getCompletedItems(
    @Query() filterItems: FilterItems,
  ): Promise<ResponseObject<Item[]>> {
    const data = await this.itemService.find(
      {
        status: StatusEnum.completed,
      },
      null,
      {
        skip: filterItems.skip,
        limit: filterItems.limit,
      },
      {
        createdAt: filterItems?.latest,
      },
    );
    return new ResponseObject('ITEMS_FOUND', data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createItem(
    @Body() item: CreateItemDto,
    @Request() req,
  ): Promise<ResponseObject<Item>> {
    const data = await this.itemService.createItem(req.auth.user, item);
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
    const data = await this.itemService.bidOnItem(
      params.id,
      req.auth.user,
      bid,
    );
    return new ResponseObject('ITEM_BID', data);
  }
}
