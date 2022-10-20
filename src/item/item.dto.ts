import { CurrencyEnum, PriceMap } from '../types/item.types';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
  IsObject, IsDate,
} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class PriceDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  currency: CurrencyEnum;
}

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsDefined()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => PriceDto)
  startedPrice: PriceMap;


  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  timeWindow: Date;
}
