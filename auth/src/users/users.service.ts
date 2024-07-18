import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.enitity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let user = new User();

    user = {
      ...user,
      ...createUserDto,
    };

    console.log('user', user);

    return this.usersRepository.save(user);
  }

  async findOne(name: string) {
    return this.usersRepository.findOneByOrFail({ name });
  }
}
