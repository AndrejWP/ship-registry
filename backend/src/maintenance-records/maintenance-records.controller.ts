import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';
import { MaintenanceRecordsService } from './maintenance-records.service';

@ApiTags('maintenance records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('maintenance-records')
export class MaintenanceRecordsController {
  constructor(private readonly recordsService: MaintenanceRecordsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER, UserRole.VIEWER)
  findAll() {
    return this.recordsService.findAll();
  }
}

