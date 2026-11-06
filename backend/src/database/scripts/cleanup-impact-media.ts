import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import AppDataSource from '../data-source';
import { IMPACT_MEDIA_PREFIX } from '../../modules/impact-initiatives/impact-media';

dotenv.config();

/**
 * Removes Our Impact section media that no initiative references, e.g. files
 * uploaded in the page editor and then abandoned without saving.
 * Initiatives in Recently deleted still count as references.
 *
 * Run: npm run cleanup:impact-media [-- --dry-run] [-- --older-than-hours=24]
 * Files newer than the grace period are skipped so in-progress edits are safe.
 */
function argValue(name: string): string | undefined {
  const prefix = `--${name}=`;
  return (
    process.argv.find((a) => a.startsWith(prefix))?.slice(prefix.length) ??
    // npm keeps flags for itself when `--` is dropped (e.g. by PowerShell)
    process.env[`npm_config_${name.replace(/-/g, '_')}`]
  );
}

async function cleanup() {
  const dryRun =
    process.argv.includes('--dry-run') ||
    process.env.npm_config_dry_run === 'true';
  const graceHours = Number(argValue('older-than-hours') ?? 24);
  if (!Number.isFinite(graceHours) || graceHours < 1) {
    throw new Error('--older-than-hours must be a number of at least 1.');
  }

  const {
    R2_ENDPOINT,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
    R2_PUBLIC_URL,
  } = process.env;
  if (
    !R2_ENDPOINT ||
    !R2_ACCESS_KEY_ID ||
    !R2_SECRET_ACCESS_KEY ||
    !R2_BUCKET_NAME ||
    !R2_PUBLIC_URL
  ) {
    throw new Error(
      'R2 is not configured. Set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME and R2_PUBLIC_URL.',
    );
  }
  const publicUrl = R2_PUBLIC_URL.replace(/\/$/, '');
  const client = new S3Client({
    region: process.env.R2_REGION ?? 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  await AppDataSource.initialize();
  const rows: { content: string | null }[] = await AppDataSource.query(
    `SELECT content::text AS content FROM impact_initiatives WHERE content IS NOT NULL`,
  );
  const allContent = rows.map((r) => r.content ?? '').join('\n');
  await AppDataSource.destroy();

  const cutoff = Date.now() - graceHours * 60 * 60 * 1000;
  const orphanKeys: string[] = [];
  let scanned = 0;
  let continuationToken: string | undefined;

  do {
    const page: ListObjectsV2CommandOutput = await client.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: IMPACT_MEDIA_PREFIX,
        ContinuationToken: continuationToken,
      }),
    );
    for (const obj of page.Contents ?? []) {
      if (!obj.Key || obj.Key === IMPACT_MEDIA_PREFIX) continue;
      scanned++;
      if (obj.LastModified && obj.LastModified.getTime() > cutoff) continue;
      if (!allContent.includes(`${publicUrl}/${obj.Key}`)) {
        orphanKeys.push(obj.Key);
      }
    }
    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (continuationToken);

  // eslint-disable-next-line no-console
  console.log(
    `[cleanup] Scanned ${scanned} file(s) under ${IMPACT_MEDIA_PREFIX}; ${orphanKeys.length} unused and older than ${graceHours}h.`,
  );

  if (dryRun) {
    // eslint-disable-next-line no-console
    orphanKeys.forEach((key) => console.log(`  would delete ${key}`));
    return;
  }

  for (let i = 0; i < orphanKeys.length; i += 1000) {
    const batch = orphanKeys.slice(i, i + 1000);
    const result = await client.send(
      new DeleteObjectsCommand({
        Bucket: R2_BUCKET_NAME,
        Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
      }),
    );
    result.Errors?.forEach((e) =>
      // eslint-disable-next-line no-console
      console.warn(`  failed ${e.Key}: ${e.Message}`),
    );
  }

  // eslint-disable-next-line no-console
  console.log(`[cleanup] Deleted ${orphanKeys.length} unused file(s).`);
}

cleanup().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error('[cleanup] Failed:', err);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
