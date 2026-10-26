import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import AppDataSource from '../data-source';
import { User } from '../../modules/users/entities/user.entity';

dotenv.config();

/**
 * Super-admin seeder — idempotent.
 * Run: npm run seed
 *
 * Env (optional overrides):
 *   ADMIN_FULL_NAME
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 */
async function seed() {
  const fullName = process.env.ADMIN_FULL_NAME ?? 'IHDUA Admin';
  const email = (process.env.ADMIN_EMAIL ?? 'admin@ihdua.org')
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? 'Admin@123';

  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);

  const existing = await repo.findOne({
    where: { email },
  });

  if (existing) {
    // eslint-disable-next-line no-console
    console.log(
      `[seed] Admin already exists (email=${existing.email}). Skipping.`,
    );
    await AppDataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = repo.create({
    fullName,
    email,
    passwordHash,
  });

  const saved = await repo.save(user);
  // eslint-disable-next-line no-console
  console.log('[seed] Admin created successfully:');
  // eslint-disable-next-line no-console
  console.log(`  id:       ${saved.id}`);
  // eslint-disable-next-line no-console
  console.log(`  fullName: ${saved.fullName}`);
  // eslint-disable-next-line no-console
  console.log(`  email:    ${saved.email}`);
  // eslint-disable-next-line no-console
  console.log(`  password: ${password}`);
  // eslint-disable-next-line no-console
  console.log('[seed] Change the password after first login.');

  await AppDataSource.destroy();
}

seed().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] Failed:', err);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
