import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MaintenanceRecord } from './maintenance-record.entity';
import { Voyage } from './voyage.entity';

export enum ShipStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  DECOMMISSIONED = 'DECOMMISSIONED',
}

@Entity('ships')
export class Ship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ name: 'imo_number', unique: true })
  imoNumber: string;

  @Column({ name: 'build_year', type: 'int' })
  buildYear: number;

  @Column({ type: 'int' })
  capacity: number;

  @Column({
    type: 'varchar',
    default: ShipStatus.ACTIVE,
  })
  status: ShipStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Voyage, (voyage) => voyage.ship)
  voyages: Voyage[];

  @OneToMany(() => MaintenanceRecord, (record) => record.ship)
  maintenanceRecords: MaintenanceRecord[];
}
