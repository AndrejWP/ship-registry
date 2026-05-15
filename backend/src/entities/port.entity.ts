import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Voyage } from './voyage.entity';

@Entity('ports')
export class Port {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @OneToMany(() => Voyage, (voyage) => voyage.departurePort)
  departureVoyages: Voyage[];

  @OneToMany(() => Voyage, (voyage) => voyage.arrivalPort)
  arrivalVoyages: Voyage[];
}

