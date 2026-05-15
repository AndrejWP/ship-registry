import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Captain } from '../entities/captain.entity';
import { Port } from '../entities/port.entity';
import { Ship } from '../entities/ship.entity';
import { Voyage } from '../entities/voyage.entity';
import { CreateVoyageDto } from './dto/create-voyage.dto';
import { UpdateVoyageDto } from './dto/update-voyage.dto';

@Injectable()
export class VoyagesService {
  constructor(
    @InjectRepository(Voyage) private readonly voyagesRepository: Repository<Voyage>,
    @InjectRepository(Ship) private readonly shipsRepository: Repository<Ship>,
    @InjectRepository(Captain) private readonly captainsRepository: Repository<Captain>,
    @InjectRepository(Port) private readonly portsRepository: Repository<Port>,
  ) {}

  findAll(): Promise<Voyage[]> {
    return this.voyagesRepository.find({
      relations: ['ship', 'captain', 'departurePort', 'arrivalPort'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Voyage> {
    const voyage = await this.voyagesRepository.findOne({
      where: { id },
      relations: ['ship', 'captain', 'departurePort', 'arrivalPort'],
    });

    if (!voyage) {
      throw new NotFoundException('Voyage not found');
    }

    return voyage;
  }

  async create(dto: CreateVoyageDto): Promise<Voyage> {
    this.validateDates(dto.departureDate, dto.arrivalDate);
    await this.validateReferences(dto);

    const voyage = this.voyagesRepository.create(dto);
    const saved = await this.voyagesRepository.save(voyage);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateVoyageDto): Promise<Voyage> {
    const voyage = await this.voyagesRepository.findOne({ where: { id } });
    if (!voyage) {
      throw new NotFoundException('Voyage not found');
    }

    const nextDepartureDate = dto.departureDate ?? voyage.departureDate;
    const nextArrivalDate = dto.arrivalDate ?? voyage.arrivalDate;
    this.validateDates(nextDepartureDate, nextArrivalDate);
    await this.validateReferences(dto);

    Object.assign(voyage, dto);
    await this.voyagesRepository.save(voyage);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const voyage = await this.voyagesRepository.findOne({ where: { id } });
    if (!voyage) {
      throw new NotFoundException('Voyage not found');
    }

    await this.voyagesRepository.remove(voyage);
  }

  private validateDates(departureDate: string, arrivalDate: string) {
    if (new Date(arrivalDate) <= new Date(departureDate)) {
      throw new BadRequestException('Arrival date must be later than departure date');
    }
  }

  private async validateReferences(dto: Partial<CreateVoyageDto>) {
    if (dto.shipId) {
      await this.ensureExists(this.shipsRepository, dto.shipId, 'Ship not found');
    }

    if (dto.captainId) {
      await this.ensureExists(this.captainsRepository, dto.captainId, 'Captain not found');
    }

    if (dto.departurePortId) {
      await this.ensureExists(this.portsRepository, dto.departurePortId, 'Departure port not found');
    }

    if (dto.arrivalPortId) {
      await this.ensureExists(this.portsRepository, dto.arrivalPortId, 'Arrival port not found');
    }
  }

  private async ensureExists<T extends { id: number }>(
    repository: Repository<T>,
    id: number,
    message: string,
  ) {
    const count = await repository.count({ where: { id } as FindOptionsWhere<T> });
    if (count === 0) {
      throw new NotFoundException(message);
    }
  }
}
