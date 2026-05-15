import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Ship } from '../entities/ship.entity';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';

@Injectable()
export class ShipsService {
  constructor(@InjectRepository(Ship) private readonly shipsRepository: Repository<Ship>) {}

  findAll(search?: string): Promise<Ship[]> {
    if (!search) {
      return this.shipsRepository.find({ order: { id: 'ASC' } });
    }

    return this.shipsRepository.find({
      where: [{ name: ILike(`%${search}%`) }, { imoNumber: ILike(`%${search}%`) }],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Ship> {
    const ship = await this.shipsRepository.findOne({ where: { id } });
    if (!ship) {
      throw new NotFoundException('Ship not found');
    }

    return ship;
  }

  async create(dto: CreateShipDto): Promise<Ship> {
    try {
      const ship = this.shipsRepository.create(dto);
      return await this.shipsRepository.save(ship);
    } catch (error) {
      return this.handleDatabaseError(error);
    }
  }

  async update(id: number, dto: UpdateShipDto): Promise<Ship> {
    const ship = await this.findOne(id);
    Object.assign(ship, dto);

    try {
      return await this.shipsRepository.save(ship);
    } catch (error) {
      return this.handleDatabaseError(error);
    }
  }

  async remove(id: number): Promise<void> {
    const ship = await this.findOne(id);
    await this.shipsRepository.remove(ship);
  }

  private handleDatabaseError(error: unknown): never {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      throw new ConflictException('Ship with this IMO number already exists');
    }

    throw error;
  }
}
