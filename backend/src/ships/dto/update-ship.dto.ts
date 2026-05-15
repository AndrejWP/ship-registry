import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ShipStatus } from '../../entities/ship.entity';

export class UpdateShipDto {
  @ApiPropertyOptional({ example: 'Aurora Star' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Container ship' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'IMO1234567' })
  @IsOptional()
  @IsString()
  imoNumber?: string;

  @ApiPropertyOptional({ example: 2015 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2100)
  buildYear?: number;

  @ApiPropertyOptional({ example: 25000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ enum: ShipStatus, example: ShipStatus.MAINTENANCE })
  @IsOptional()
  @IsEnum(ShipStatus)
  status?: ShipStatus;
}

