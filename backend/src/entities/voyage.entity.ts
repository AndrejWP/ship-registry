import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Captain } from './captain.entity';
import { Port } from './port.entity';
import { Ship } from './ship.entity';

export enum VoyageStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('voyages')
export class Voyage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ship_id' })
  shipId: number;

  @ManyToOne(() => Ship, (ship) => ship.voyages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ship_id' })
  ship: Ship;

  @Column({ name: 'captain_id' })
  captainId: number;

  @ManyToOne(() => Captain, (captain) => captain.voyages, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'captain_id' })
  captain: Captain;

  @Column({ name: 'departure_port_id' })
  departurePortId: number;

  @ManyToOne(() => Port, (port) => port.departureVoyages, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'departure_port_id' })
  departurePort: Port;

  @Column({ name: 'arrival_port_id' })
  arrivalPortId: number;

  @ManyToOne(() => Port, (port) => port.arrivalVoyages, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'arrival_port_id' })
  arrivalPort: Port;

  @Column({ name: 'departure_date', type: 'date' })
  departureDate: string;

  @Column({ name: 'arrival_date', type: 'date' })
  arrivalDate: string;

  @Column({
    type: 'varchar',
    default: VoyageStatus.SCHEDULED,
  })
  status: VoyageStatus;
}
