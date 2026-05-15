import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ship } from '../entities/ship.entity';
import { ShipsController } from './ships.controller';
import { ShipsService } from './ships.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ship])],
  controllers: [ShipsController],
  providers: [ShipsService],
})
export class ShipsModule {}
