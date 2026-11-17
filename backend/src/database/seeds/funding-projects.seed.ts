import * as dotenv from 'dotenv';
import AppDataSource from '../data-source';
import { ContentStatus } from '../../common/enums/content-status.enum';
import {
  FundingComponentJson,
  FundingProject,
} from '../../modules/funding-projects/entities/funding-project.entity';
import FUNDING_PROJECT_SEED from './funding-projects.data';

dotenv.config();

type SeedRow = {
  slug: string;
  projectNumber: string;
  title: string;
  summary: string;
  totalLabel: string;
  cause: string;
  highlights: string[];
  components: FundingComponentJson[];
  sortOrder: number;
};

/**
 * Idempotent seed of the 9 PDF funding projects (published).
 * Run: pnpm run seed:funding
 */
async function seed() {
  const rows = FUNDING_PROJECT_SEED as unknown as SeedRow[];

  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(FundingProject);

  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const existing = await repo.findOne({ where: { slug: row.slug } });
    const payload = {
      slug: row.slug,
      projectNumber: row.projectNumber,
      title: row.title,
      summary: row.summary,
      totalLabel: row.totalLabel,
      cause: row.cause,
      highlights: [...(row.highlights || [])],
      components: (row.components || []).map((c) => ({ ...c })),
      sortOrder: row.sortOrder,
      status: ContentStatus.PUBLISHED,
    };

    if (existing) {
      Object.assign(existing, payload);
      await repo.save(existing);
      updated += 1;
      continue;
    }

    await repo.save(repo.create(payload));
    created += 1;
  }

  // eslint-disable-next-line no-console
  console.log(
    `[seed] Funding projects: created=${created}, updated=${updated}, total=${rows.length}`,
  );
  await AppDataSource.destroy();
}

seed().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] Funding projects failed:', err);
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
  process.exit(1);
});
