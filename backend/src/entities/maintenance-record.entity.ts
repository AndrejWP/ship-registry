import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ship } from './ship.entity';

@Entity('maintenance_records')
export class MaintenanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ship_id' })
  shipId: number;

  @ManyToOne(() => Ship, (ship) => ship.maintenanceRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ship_id' })
  ship: Ship;

  @Column()
  description: string;

  @Column({ name: 'maintenance_date', type: 'date' })
  maintenanceDate: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  cost: string;
}

