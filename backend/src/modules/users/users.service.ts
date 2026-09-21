import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

export type CreateUserInput = {
  fullName: string;
  email: string;
  passwordHash: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  create(input: CreateUserInput) {
    const user = this.usersRepository.create(input);
    return this.usersRepository.save(user);
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll() {
    const users = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });

    return users.map(({ passwordHash: _passwordHash, ...safe }) => safe);
  }

  async findOneSafe(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _passwordHash, ...safe } = user;
    return safe;
  }
}
