import { CurrencyEnum, PriceMap } from '../types/item.types';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
  IsObject,
  IsMongoId,
  IsDateString,
  IsOptional,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { PaginationDto } from '../abstract/pagination.dto';

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
  @IsDateString()
  timeWindow: Date;
}

export class IdDto {
  @IsMongoId()
  @IsNotEmpty()
  id: Types.ObjectId;
}

export class FilterItems extends PaginationDto {
  @Type(() => Number)
  @IsInt()
  @IsEnum([1, -1])
  @IsNotEmpty()
  @IsOptional()
  latest: number;

  @Type(() => Number)
  @IsInt()
  @IsEnum([1, -1])
  @IsNotEmpty()
  @IsOptional()
  highest: number;
}
