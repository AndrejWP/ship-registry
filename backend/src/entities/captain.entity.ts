import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Voyage } from './voyage.entity';

@Entity('captains')
export class Captain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'license_number', unique: true })
  licenseNumber: string;

  @Column({ name: 'experience_years', type: 'int' })
  experienceYears: number;

  @OneToMany(() => Voyage, (voyage) => voyage.captain)
  voyages: Voyage[];
}

