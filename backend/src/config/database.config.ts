import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { Captain } from '../entities/captain.entity';
import { MaintenanceRecord } from '../entities/maintenance-record.entity';
import { Port } from '../entities/port.entity';
import { Ship } from '../entities/ship.entity';
import { User } from '../entities/user.entity';
import { Voyage } from '../entities/voyage.entity';

export function createDatabaseConfig(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: config.get<string>('DB_HOST', 'localhost'),
    port: Number(config.get<string>('DB_PORT', '5432')),
    username: config.get<string>('DB_USERNAME', 'ship_user'),
    password: config.get<string>('DB_PASSWORD', 'ship_password'),
    database: config.get<string>('DB_DATABASE', 'ship_registry'),
    entities: [User, Ship, Port, Captain, Voyage, MaintenanceRecord, AuditLog],
    synchronize: false,
  };
}

