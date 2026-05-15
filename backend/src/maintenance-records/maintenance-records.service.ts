import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRecord } from '../entities/maintenance-record.entity';

@Injectable()
export class MaintenanceRecordsService {
  constructor(
    @InjectRepository(MaintenanceRecord)
    private readonly recordsRepository: Repository<MaintenanceRecord>,
  ) {}

  findAll(): Promise<MaintenanceRecord[]> {
    return this.recordsRepository.find({
      relations: ['ship'],
      order: { id: 'ASC' },
    });
  }
}

