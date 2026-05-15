import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'entity_name' })
  entityName: string;

  @Column({ name: 'entity_id' })
  entityId: number;

  @Column()
  action: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

