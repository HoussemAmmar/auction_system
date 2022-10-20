import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { StatusEnum } from 'src/types/item.types';
import { CreateItemDto } from './item.dto';
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
}
