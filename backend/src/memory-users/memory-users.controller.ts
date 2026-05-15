import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMemoryUserDto } from './dto/create-memory-user.dto';
import { MemoryUsersService } from './memory-users.service';

@ApiTags('memory users')
@Controller('users')
export class MemoryUsersController {
  constructor(private readonly memoryUsersService: MemoryUsersService) {}

  @Get()
  findAll() {
    return this.memoryUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.memoryUsersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateMemoryUserDto) {
    return this.memoryUsersService.create(dto);
  }
}

