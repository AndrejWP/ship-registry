import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceRecord } from '../entities/maintenance-record.entity';
import { MaintenanceRecordsController } from './maintenance-records.controller';
import { MaintenanceRecordsService } from './maintenance-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceRecord])],
  controllers: [MaintenanceRecordsController],
  providers: [MaintenanceRecordsService],
})
export class MaintenanceRecordsModule {}
