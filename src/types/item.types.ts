import { SchemaTypes } from 'mongoose';

export const PriceMapSchema = {
  amount: { type: SchemaTypes.Number, required: true },
  currency: { type: SchemaTypes.Number, required: true },
};

export type PriceMap = {
  amount: number;
  currency: CurrencyEnum;
};

export enum CurrencyEnum {
  usd = 'usd',
}

export enum StatusEnum {
  drafted = 'drafted',
  ongoing = 'ongoing',
  completed = 'completed',
}

