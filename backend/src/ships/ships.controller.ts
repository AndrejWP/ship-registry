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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../entities/user.entity';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';
import { ShipsService } from './ships.service';

@ApiTags('ships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ships')
export class ShipsController {
  constructor(private readonly shipsService: ShipsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER, UserRole.VIEWER)
  findAll(@Query('search') search?: string) {
    return this.shipsService.findAll(search);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER, UserRole.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shipsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER)
  create(@Body() dto: CreateShipDto) {
    return this.shipsService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DISPATCHER)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateShipDto) {
    return this.shipsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shipsService.remove(id);
  }
}
