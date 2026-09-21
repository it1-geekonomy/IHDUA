import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const email = this.config.get<string>('admin.email', 'admin@ihdua.org');
    const password = this.config.get<string>('admin.password', 'Admin@123');
    const fullName = this.config.get<string>('admin.fullName', 'IHDUA Admin');

    const existing = await this.usersService.findByEmail(email.toLowerCase());
    if (existing) {
      this.logger.log(`Admin user already exists: ${email}`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.usersService.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
    });

    this.logger.log(`Seeded admin user: ${email}`);
  }
}
