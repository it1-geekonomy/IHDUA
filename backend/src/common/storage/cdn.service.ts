import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { extname } from 'path';

const IMAGE_TYPES = new Set(['image/webp', 'image/avif', 'image/jpeg', 'image/png']);
const DOCUMENT_TYPES = new Set(['application/pdf']);
const CV_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm']);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_CV_BYTES = 5 * 1024 * 1024;

export type CdnFileKind = 'image' | 'document' | 'video' | 'cv';

export type CdnFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

/**
 * Shared CDN service — directly manages Cloudflare R2 / S3 storage
 * and returns public CDN URLs.
 */
@Injectable()
export class CdnService {
  private readonly logger = new Logger(CdnService.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    const endpoint = this.config.get<string>('r2.endpoint');
    const accessKeyId = this.config.get<string>('r2.accessKeyId');
    const secretAccessKey = this.config.get<string>('r2.secretAccessKey');
    this.bucket = this.config.get<string>('r2.bucketName') ?? '';
    this.publicUrl = (this.config.get<string>('r2.publicUrl') ?? '').replace(
      /\/$/,
      '',
    );

    this.client = new S3Client({
      region: this.config.get<string>('r2.region') ?? 'auto',
      endpoint,
      credentials: {
        accessKeyId: accessKeyId ?? '',
        secretAccessKey: secretAccessKey ?? '',
      },
      forcePathStyle: false,
    });
  }

  private assertConfigured() {
    if (
      !this.bucket ||
      !this.publicUrl ||
      !this.config.get('r2.accessKeyId') ||
      !this.config.get('r2.secretAccessKey') ||
      !this.config.get('r2.endpoint')
    ) {
      throw new Error(
        'R2 is not configured. Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ENDPOINT, R2_PUBLIC_URL.',
      );
    }
  }

  async upload(
    file: CdnFile,
    folder: string,
    kind: CdnFileKind = 'image',
  ): Promise<string> {
    this.assertValidFile(file, kind);
    this.assertConfigured();

    const safeName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/-+/g, '-');
    const key = `${folder.replace(/\/$/, '')}/${randomUUID()}-${safeName || `file${extname(file.originalname) || ''}`}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    return `${this.publicUrl}/${key}`;
  }

  async delete(url?: string | null): Promise<void> {
    if (!url || !this.publicUrl || !url.startsWith(this.publicUrl)) return;
    this.assertConfigured();

    const key = url.slice(this.publicUrl.length + 1);
    if (!key) return;

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    this.logger.log(`File deleted from CDN: ${url}`);
  }

  async replace(
    oldUrl: string | null | undefined,
    file: CdnFile | undefined,
    folder: string,
    kind: CdnFileKind = 'image',
  ): Promise<string | null | undefined> {
    if (!file) return oldUrl;
    const nextUrl = await this.upload(file, folder, kind);
    await this.delete(oldUrl);
    return nextUrl;
  }

  private assertValidFile(file: CdnFile, kind: CdnFileKind) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Uploaded file is empty.');
    }

    if (kind === 'image') {
      if (!IMAGE_TYPES.has(file.mimetype)) {
        throw new BadRequestException(
          'Only WebP, AVIF, JPEG, or PNG images are allowed (max 5MB).',
        );
      }
      if (file.size > MAX_IMAGE_BYTES) {
        throw new BadRequestException('Image must be 5MB or smaller.');
      }
      return;
    }

    if (kind === 'document') {
      if (!DOCUMENT_TYPES.has(file.mimetype)) {
        throw new BadRequestException('Only PDF documents are allowed.');
      }
      return;
    }

    if (kind === 'cv') {
      if (!CV_TYPES.has(file.mimetype)) {
        throw new BadRequestException(
          'Only PDF, DOC, or DOCX documents are allowed (max 5MB).',
        );
      }
      if (file.size > MAX_CV_BYTES) {
        throw new BadRequestException('Resume must be 5MB or smaller.');
      }
      return;
    }

    if (!VIDEO_TYPES.has(file.mimetype)) {
      throw new BadRequestException('Only MP4 or WebM videos are allowed.');
    }
  }
}
