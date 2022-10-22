import { CurrencyEnum } from '../types/item.types';
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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PriceDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;

  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: CurrencyEnum })
  currency: CurrencyEnum;
}

export class CreateItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsObject()
  @IsDefined()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => PriceDto)
  startedPrice: PriceDto;

  @ApiProperty({ example: '2022-10-24T15:04:14.322' })
  @IsNotEmpty()
  @IsDateString()
  timeWindow: Date;
}

export class IdDto {
  @ApiProperty()
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
  @ApiPropertyOptional()
  latest: number;
}
