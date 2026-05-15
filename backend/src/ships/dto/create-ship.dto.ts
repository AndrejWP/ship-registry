import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ShipStatus } from '../../entities/ship.entity';

export class CreateShipDto {
  @ApiProperty({ example: 'Aurora Star' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Container ship' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'IMO1234567' })
  @IsString()
  @IsNotEmpty()
  imoNumber: string;

  @ApiProperty({ example: 2015 })
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2100)
  buildYear: number;

  @ApiProperty({ example: 25000 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({ enum: ShipStatus, example: ShipStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ShipStatus)
  status?: ShipStatus;
}

