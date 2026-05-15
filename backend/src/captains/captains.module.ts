import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Captain } from '../entities/captain.entity';
import { CaptainsController } from './captains.controller';
import { CaptainsService } from './captains.service';

@Module({
  imports: [TypeOrmModule.forFeature([Captain])],
  controllers: [CaptainsController],
  providers: [CaptainsService],
})
export class CaptainsModule {}

