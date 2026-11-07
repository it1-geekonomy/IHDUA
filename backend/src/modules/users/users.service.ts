import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export type CreateUserInput = {
  fullName: string;
  email: string;
  passwordHash?: string;
  password?: string;
  role?: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(input: CreateUserDto | CreateUserInput) {
    const email = input.email.trim().toLowerCase();
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException(`User with email "${email}" already exists`);
    }

    let passwordHash: string;
    if ('password' in input && input.password) {
      passwordHash = await bcrypt.hash(input.password, 10);
    } else if ('passwordHash' in input && input.passwordHash) {
      passwordHash = input.passwordHash;
    } else {
      throw new BadRequestException('Password is required');
    }

    const rawRole = input.role
      ? input.role.trim().toUpperCase()
      : UserRole.ADMIN;
    if (!Object.values(UserRole).includes(rawRole as UserRole)) {
      throw new BadRequestException(
        `Invalid role "${input.role}". Allowed roles: ${Object.values(UserRole).join(', ')}`,
      );
    }

    const user = this.usersRepository.create({
      fullName: input.fullName.trim(),
      email,
      passwordHash,
      role: rawRole,
    });

    const saved = await this.usersRepository.save(user);
    const { passwordHash: _hash, ...safe } = saved;
    return safe;
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

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (dto.email) {
      const email = dto.email.trim().toLowerCase();
      if (email !== user.email) {
        const existing = await this.findByEmail(email);
        if (existing && existing.id !== id) {
          throw new ConflictException(
            `User with email "${email}" already exists`,
          );
        }
        user.email = email;
      }
    }

    if (dto.fullName) {
      user.fullName = dto.fullName.trim();
    }

    if (dto.role) {
      const rawRole = dto.role.trim().toUpperCase();
      if (!Object.values(UserRole).includes(rawRole as UserRole)) {
        throw new BadRequestException(
          `Invalid role "${dto.role}". Allowed roles: ${Object.values(UserRole).join(', ')}`,
        );
      }
      user.role = rawRole;
    }

    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const saved = await this.usersRepository.save(user);
    const { passwordHash: _hash, ...safe } = saved;
    return safe;
  }

  async remove(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepository.softRemove(user);
  }
}
