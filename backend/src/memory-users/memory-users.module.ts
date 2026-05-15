import { Module } from '@nestjs/common';
import { MemoryUsersController } from './memory-users.controller';
import { MemoryUsersService } from './memory-users.service';

@Module({
  controllers: [MemoryUsersController],
  providers: [MemoryUsersService],
})
export class MemoryUsersModule {}
