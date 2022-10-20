import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { AbstractModel } from '../abstract/abstract.model';
import { PriceMap, PriceMapSchema, StatusEnum } from '../types/item.types';

@Schema({
  timestamps: true,
})
export class Bid extends AbstractModel {
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  user: string;

  @Prop(raw({ ...PriceMapSchema }))
  bidPrice: PriceMap;
}

const BidSchema = SchemaFactory.createForClass(Bid);

@Schema({
  timestamps: true,
})
export class Item extends AbstractModel {
  @Prop({ required: false, type: SchemaTypes.String })
  name: string;

  @Prop({ required: false, type: SchemaTypes.ObjectId })
  user: Types.ObjectId;

  @Prop(raw({ ...PriceMapSchema }))
  startedPrice: PriceMap;

  @Prop(raw({ ...PriceMapSchema }))
  highestPrice: PriceMap;

  @Prop({ required: true, enum: StatusEnum, default: StatusEnum.drafted })
  status: StatusEnum;

  @Prop({ required: false, type: SchemaTypes.Date })
  timeWindow: Date;

  @Prop({ required: true, type: [BidSchema], default: [] })
  bids?: Bid[];
}

const ItemSchema = SchemaFactory.createForClass(Item);

export { ItemSchema };
