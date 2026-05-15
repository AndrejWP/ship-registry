import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Port } from '../entities/port.entity';

@Injectable()
export class PortsService {
  constructor(@InjectRepository(Port) private readonly portsRepository: Repository<Port>) {}

  findAll(): Promise<Port[]> {
    return this.portsRepository.find({ order: { id: 'ASC' } });
  }
}

