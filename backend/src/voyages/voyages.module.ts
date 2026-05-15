import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Captain } from '../entities/captain.entity';
import { Port } from '../entities/port.entity';
import { Ship } from '../entities/ship.entity';
import { Voyage } from '../entities/voyage.entity';
import { VoyagesController } from './voyages.controller';
import { VoyagesService } from './voyages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Voyage, Ship, Captain, Port])],
  controllers: [VoyagesController],
  providers: [VoyagesService],
})
export class VoyagesModule {}
