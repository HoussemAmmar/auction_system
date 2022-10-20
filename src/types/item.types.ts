import { SchemaTypes } from 'mongoose';

export enum CurrencyEnum {
  usd = 'usd',
}
export const PriceMapSchema = {
  amount: { type: SchemaTypes.Number, required: true },
  currency: {type: SchemaTypes.String, enum: CurrencyEnum, required: true},
};

export type PriceMap = {
  amount: number;
  currency: CurrencyEnum;
};



export enum StatusEnum {
  drafted = 'drafted',
  ongoing = 'ongoing',
  completed = 'completed',
}

