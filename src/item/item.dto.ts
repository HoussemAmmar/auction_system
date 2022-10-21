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
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsObject()
  @IsDefined()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => PriceDto)
  @ApiProperty()
  startedPrice: PriceDto;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  timeWindow: Date;
}

export class IdDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ example: new Types.ObjectId() })
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

  @Type(() => Number)
  @IsInt()
  @IsEnum([1, -1])
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  highest: number;
}
