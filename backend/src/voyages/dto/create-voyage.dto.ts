import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { VoyageStatus } from '../../entities/voyage.entity';

export class CreateVoyageDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  shipId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  captainId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  departurePortId: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  arrivalPortId: number;

  @ApiProperty({ example: '2026-06-01' })
  @IsDateString()
  departureDate: string;

  @ApiProperty({ example: '2026-06-12' })
  @IsDateString()
  arrivalDate: string;

  @ApiPropertyOptional({ enum: VoyageStatus, example: VoyageStatus.SCHEDULED })
  @IsOptional()
  @IsEnum(VoyageStatus)
  status?: VoyageStatus;
}

