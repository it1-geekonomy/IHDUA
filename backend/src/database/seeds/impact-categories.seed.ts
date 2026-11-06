import * as dotenv from 'dotenv';
import { IsNull } from 'typeorm';
import AppDataSource from '../data-source';
import { ImpactCategory } from '../../modules/impact-categories/entities/impact-category.entity';
import { ContentStatus } from '../../common/enums/content-status.enum';
import { ImpactLayoutType } from '../../common/enums/impact-layout-type.enum';

dotenv.config();

/**
 * Our Impact categories seeder — idempotent.
 * Run: npm run seed:impact
 *
 * Slugs and layout types must match IMPACT_CATEGORIES in the admin
 * frontend (domains/admin/components/impact/layouts.ts).
 * Existing categories are left untouched so admin edits are preserved.
 */
const CATEGORIES: Array<
  Pick<ImpactCategory, 'name' | 'slug' | 'layoutType' | 'displayOrder'>
> = [
  {
    name: 'Education',
    slug: 'education',
    layoutType: ImpactLayoutType.EDUCATION,
    displayOrder: 1,
  },
  {
    name: 'Women Empowerment',
    slug: 'women-empowerment',
    layoutType: ImpactLayoutType.WOMEN_EMPOWERMENT,
    displayOrder: 2,
  },
  {
    name: 'Skills & Employment',
    slug: 'skills-and-employment',
    layoutType: ImpactLayoutType.SKILLS_EMPLOYMENT,
    displayOrder: 3,
  },
  {
    name: 'Model Village',
    slug: 'model-village',
    layoutType: ImpactLayoutType.MODEL_VILLAGE,
    displayOrder: 4,
  },
  {
    name: 'Health',
    slug: 'health',
    layoutType: ImpactLayoutType.HEALTH,
    displayOrder: 5,
  },
];

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(ImpactCategory);

  let created = 0;
  for (const def of CATEGORIES) {
    const existing = await repo.findOne({
      where: { slug: def.slug, deletedAt: IsNull() },
    });

    if (existing) {
      if (existing.layoutType !== def.layoutType) {
        // eslint-disable-next-line no-console
        console.warn(
          `[seed] "${def.slug}" exists with layout "${existing.layoutType}" (expected "${def.layoutType}"). Left unchanged.`,
        );
      } else {
        // eslint-disable-next-line no-console
        console.log(`[seed] "${def.slug}" already exists. Skipping.`);
      }
      continue;
    }

    await repo.save(repo.create({ ...def, status: ContentStatus.PUBLISHED }));
    created++;
    // eslint-disable-next-line no-console
    console.log(`[seed] Created impact category "${def.name}".`);
  }

  // eslint-disable-next-line no-console
  console.log(
    `[seed] Impact categories done: ${created} created, ${CATEGORIES.length - created} already present.`,
  );

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
