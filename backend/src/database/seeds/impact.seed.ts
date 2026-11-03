import * as dotenv from 'dotenv';
import AppDataSource from '../data-source';

dotenv.config();

/**
 * Clean & Seed Impact Data:
 * - Categories (5)
 * - Initiatives (11)
 * - Initiative Stories
 * - Impact Stats (4 cards)
 *
 * Run: npm run seed:impact
 */
export async function seedImpact() {
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    console.log('[seed] Cleaning existing impact tables...');
    await queryRunner.query('DELETE FROM impact_initiative_stories');
    await queryRunner.query('DELETE FROM impact_initiatives');
    await queryRunner.query('DELETE FROM impact_categories');
    await queryRunner.query('DELETE FROM impact_stats');

    console.log('[seed] Inserting 5 Impact Categories...');
    const categories = [
      { name: 'Education', slug: 'education', display_order: 1, status: 'published' },
      { name: 'Women Empowerment', slug: 'women-empowerment', display_order: 2, status: 'published' },
      { name: 'Skills & Employment', slug: 'skills-and-employment', display_order: 3, status: 'published' },
      { name: 'Model Village', slug: 'model-village', display_order: 4, status: 'published' },
      { name: 'Health', slug: 'health', display_order: 5, status: 'published' },
    ];

    const categoryMap = new Map<string, string>();
    for (const cat of categories) {
      const res = await queryRunner.query(
        `INSERT INTO impact_categories (name, slug, display_order, status)
         VALUES ($1, $2, $3, $4)
         RETURNING id, slug`,
        [cat.name, cat.slug, cat.display_order, cat.status],
      );
      categoryMap.set(res[0].slug, res[0].id);
      console.log(`  ✓ Category created: ${cat.name} (${cat.slug}) -> ${res[0].id}`);
    }

    console.log('[seed] Inserting 11 Impact Initiatives & Stories...');
    const initiatives = [
      // Education
      {
        categorySlug: 'education',
        name: 'Adarsha Academy KRS',
        slug: 'adarsha-academy-krs',
        display_order: 1,
        status: 'published',
        stories: [
          {
            title: 'Empowering Rural Children with Modern STEM Education',
            content: 'Adarsha Academy KRS provides rural students with quality bilingual education, dedicated STEM laboratories, and computer training to bridge the urban-rural divide.',
            image_url: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/b85a5ab6-c213-4782-8152-6fb4a1a942ab-award_1920x2400.webp',
            display_order: 1,
          },
        ],
      },
      {
        categorySlug: 'education',
        name: 'Vinayaka Gnana Vidyashale Mysore',
        slug: 'vinayakagnana-vidyashale-mysore',
        display_order: 2,
        status: 'published',
        stories: [
          {
            title: 'Holistic Rural Learning & Nutritious Support',
            content: 'Providing subsidized education, arts, sports, and midday nourishment programs ensuring no child drops out of school due to economic hardship.',
            image_url: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/b85a5ab6-c213-4782-8152-6fb4a1a942ab-award_1920x2400.webp',
            display_order: 1,
          },
        ],
      },

      // Women Empowerment
      {
        categorySlug: 'women-empowerment',
        name: 'Self-Help Group Federation',
        slug: 'self-help-group-federation',
        display_order: 1,
        status: 'published',
        stories: [
          {
            title: '7,578+ Rural Women Mobilized in 18 Federations',
            content: 'Through weekly micro-savings and mutual solidarity, women across 202+ villages have built financial independence and elevated their community leadership.',
            image_url: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/664b7e2e-04e1-4a71-b668-ebbd28b29b5a-t1_960x1140.webp',
            display_order: 1,
          },
        ],
      },
      {
        categorySlug: 'women-empowerment',
        name: 'Micro-Finance Initiatives',
        slug: 'micro-finance-initiatives',
        display_order: 2,
        status: 'published',
        stories: [
          {
            title: '₹9.14+ Crores in Low-Interest Bank Credit Linkages',
            content: 'Over 218 institutional credit linkages established, funding dairy units, grocery kiosks, and sustainable micro-enterprises for village families.',
            image_url: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/664b7e2e-04e1-4a71-b668-ebbd28b29b5a-t1_960x1140.webp',
            display_order: 1,
          },
        ],
      },

      // Skills & Employment
      {
        categorySlug: 'skills-and-employment',
        name: 'Youth Development & Vocational Training',
        slug: 'youth',
        display_order: 1,
        status: 'published',
        stories: [
          {
            title: 'Youth IT & General Duty Nursing Certifications',
            content: 'Certified 514+ students in computer communications and 267+ youth as General Duty Nursing Assistants placed in hospitals and clinics.',
            image_url: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/b85a5ab6-c213-4782-8152-6fb4a1a942ab-award_1920x2400.webp',
            display_order: 1,
          },
        ],
      },
      {
        categorySlug: 'skills-and-employment',
        name: 'Stitching & Garment Production Unit',
        slug: 'stitching-unit',
        display_order: 2,
        status: 'published',
        stories: [
          {
            title: '2,174+ Women Graduated in Professional Garment Making',
            content: 'Equipping rural women with industrial sewing and tailoring skills, enabling them to produce school uniforms and commercial apparel with sustainable income.',
            image_url: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/664b7e2e-04e1-4a71-b668-ebbd28b29b5a-t1_960x1140.webp',
            display_order: 1,
          },
        ],
      },

      // Model Village
      {
        categorySlug: 'model-village',
        name: 'Rejuvenation of Villages',
        slug: 'rejuvenation-of-villages',
        display_order: 1,
        status: 'published',
        stories: [
          {
            title: 'Holistic Rural Infrastructure & Sanitation',
            content: 'Revitalizing village commons with community sanitation, solar lighting, and clean drinking water filtration systems.',
            image_url: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/b85a5ab6-c213-4782-8152-6fb4a1a942ab-award_1920x2400.webp',
            display_order: 1,
          },
        ],
      },
      {
        categorySlug: 'model-village',
        name: 'Farmers Support & Sustainable Agriculture',
        slug: 'farmers',
        display_order: 2,
        status: 'published',
        stories: [
          {
            title: 'Empowering 43 Farmer SHGs with Organic Methods',
            content: 'Guiding rural farmers in drip irrigation, seed saving, organic compost, and direct market linkage to protect local biodiversity.',
            image_url: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/b85a5ab6-c213-4782-8152-6fb4a1a942ab-award_1920x2400.webp',
            display_order: 1,
          },
        ],
      },
      {
        categorySlug: 'model-village',
        name: 'Increase the Green Cover',
        slug: 'increase-the-green-cover',
        display_order: 3,
        status: 'published',
        stories: [
          {
            title: 'Restoring Ecosystems and Green Canopy Across Villages',
            content: 'Planting thousands of native fruit and shade trees across school grounds and public lands, creating sustainable environmental micro-climates.',
            image_url: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/b85a5ab6-c213-4782-8152-6fb4a1a942ab-award_1920x2400.webp',
            display_order: 1,
          },
        ],
      },

      // Health
      {
        categorySlug: 'health',
        name: 'Health Awareness & Preventive Care',
        slug: 'health-awareness',
        display_order: 1,
        status: 'published',
        stories: [
          {
            title: 'Grassroots Health & Hygiene Workshops',
            content: 'Educating mothers and families on maternal nutrition, menstrual hygiene, disease prevention, and child wellness in remote hamlets.',
            image_url: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/664b7e2e-04e1-4a71-b668-ebbd28b29b5a-t1_960x1140.webp',
            display_order: 1,
          },
        ],
      },
      {
        categorySlug: 'health',
        name: 'Free Medical & Healthcare Camps',
        slug: 'health-camps',
        display_order: 2,
        status: 'published',
        stories: [
          {
            title: '28+ Medical Camps Serving 3,487+ Rural Beneficiaries',
            content: 'Delivering free specialist consultations, pediatric checkups, free spectacles, medicines, and diagnostic screenings directly to village doorsteps.',
            image_url: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/b85a5ab6-c213-4782-8152-6fb4a1a942ab-award_1920x2400.webp',
            display_order: 1,
          },
        ],
      },
    ];

    for (const init of initiatives) {
      const categoryId = categoryMap.get(init.categorySlug);
      if (!categoryId) {
        throw new Error(`Category not found for slug: ${init.categorySlug}`);
      }

      const res = await queryRunner.query(
        `INSERT INTO impact_initiatives (category_id, name, slug, display_order, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [categoryId, init.name, init.slug, init.display_order, init.status],
      );
      const initiativeId = res[0].id;
      console.log(`  ✓ Initiative created: ${init.name} (${init.slug}) -> ${initiativeId}`);

      if (init.stories && init.stories.length > 0) {
        for (const story of init.stories) {
          await queryRunner.query(
            `INSERT INTO impact_initiative_stories (initiative_id, title, content, image_url, display_order)
             VALUES ($1, $2, $3, $4, $5)`,
            [initiativeId, story.title, story.content, story.image_url, story.display_order],
          );
          console.log(`    ↳ Story added: "${story.title}"`);
        }
      }
    }

    console.log('[seed] Inserting 4 Impact Stats Cards...');
    const stats = [
      { metric_name: 'Villages Reached', metric_value: '202+', card_position: 'first' },
      { metric_name: 'Self-Help Groups Supported', metric_value: '600+', card_position: 'second' },
      { metric_name: 'Bank Loans Facilitated', metric_value: '₹9.14 Cr', card_position: 'third' },
      { metric_name: 'People & Youth Trained', metric_value: '5,000+', card_position: 'fourth' },
    ];

    for (const stat of stats) {
      await queryRunner.query(
        `INSERT INTO impact_stats (metric_name, metric_value, card_position)
         VALUES ($1, $2, $3)`,
        [stat.metric_name, stat.metric_value, stat.card_position],
      );
      console.log(`  ✓ Stat Card [${stat.card_position}]: ${stat.metric_name} = ${stat.metric_value}`);
    }

    await queryRunner.commitTransaction();
    console.log('\n✅ [seed] Impact data cleaned and seeded successfully!');
  } catch (error) {
    console.error('❌ [seed] Failed to seed impact data:', error);
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

if (require.main === module) {
  seedImpact().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

