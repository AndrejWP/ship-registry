import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemoryUserDto } from './dto/create-memory-user.dto';
import { MemoryUser } from './memory-user.interface';

@Injectable()
export class MemoryUsersService {
  private users: MemoryUser[] = [
    { id: 1, name: 'Demo Student', email: 'student@example.com', age: 21 },
  ];
  private nextId = 2;

  findAll(): MemoryUser[] {
    return this.users;
  }

  findOne(id: number): MemoryUser {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException('Memory user not found');
    }

    return user;
  }

  create(dto: CreateMemoryUserDto): MemoryUser {
    const user = {
      id: this.nextId++,
      ...dto,
    };
    this.users.push(user);
    return user;
  }
}

