import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CaptainsModule } from './captains/captains.module';
import { createDatabaseConfig } from './config/database.config';
import { MaintenanceRecordsModule } from './maintenance-records/maintenance-records.module';
import { MemoryUsersModule } from './memory-users/memory-users.module';
import { PortsModule } from './ports/ports.module';
import { ShipsModule } from './ships/ships.module';
import { VoyagesModule } from './voyages/voyages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: createDatabaseConfig,
    }),
    AuthModule,
    MemoryUsersModule,
    ShipsModule,
    VoyagesModule,
    PortsModule,
    CaptainsModule,
    MaintenanceRecordsModule,
  ],
})
export class AppModule {}
