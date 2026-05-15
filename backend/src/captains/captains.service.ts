import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Captain } from '../entities/captain.entity';

@Injectable()
export class CaptainsService {
  constructor(@InjectRepository(Captain) private readonly captainsRepository: Repository<Captain>) {}

  findAll(): Promise<Captain[]> {
    return this.captainsRepository.find({ order: { id: 'ASC' } });
  }
}

