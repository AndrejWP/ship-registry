import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';
import { CreateVoyageDto } from './dto/create-voyage.dto';
import { UpdateVoyageDto } from './dto/update-voyage.dto';
import { VoyagesService } from './voyages.service';

@ApiTags('voyages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('voyages')
export class VoyagesController {
  constructor(private readonly voyagesService: VoyagesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER, UserRole.VIEWER)
  findAll() {
    return this.voyagesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER, UserRole.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.voyagesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER)
  create(@Body() dto: CreateVoyageDto) {
    return this.voyagesService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVoyageDto) {
    return this.voyagesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.voyagesService.remove(id);
  }
}
