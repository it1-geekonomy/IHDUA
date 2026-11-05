import { NextRequest, NextResponse } from "next/server";
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  type ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";

const PREFIX = "website/";

const ALLOWED_TYPES: Record<string, string> = {
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
};

// nginx client_max_body_size in production must be at least 1g for this to apply
const MAX_FILE_BYTES = 1024 * 1024 * 1024;

let r2: { client: S3Client; bucket: string; publicUrl: string } | undefined;

function getR2() {
  if (r2) return r2;
  const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL } =
    process.env;
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
    throw new Error(
      "R2 is not configured. Set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME and R2_PUBLIC_URL."
    );
  }
  r2 = {
    client: new S3Client({
      region: process.env.R2_REGION || "auto",
      endpoint: R2_ENDPOINT,
      credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    }),
    bucket: R2_BUCKET_NAME,
    publicUrl: R2_PUBLIC_URL.replace(/\/$/, ""),
  };
  return r2;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unexpected error";
}

export async function GET() {
  try {
    const { client, bucket, publicUrl } = getR2();
    const objects: { key: string; url: string; size: number }[] = [];
    let continuationToken: string | undefined;

    do {
      const response: ListObjectsV2CommandOutput = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: PREFIX,
          ContinuationToken: continuationToken,
        })
      );
      response.Contents?.forEach((obj) => {
        if (!obj.Key || obj.Key === PREFIX) return;
        objects.push({ key: obj.Key, url: `${publicUrl}/${obj.Key}`, size: obj.Size ?? 0 });
      });
      continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
    } while (continuationToken);

    return NextResponse.json(objects);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { client, bucket, publicUrl } = getR2();
    const formData = await req.formData();
    const files = formData.getAll("file").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "At least one file is required" }, { status: 400 });
    }

    const allowedMime = Object.values(ALLOWED_TYPES);
    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (!ALLOWED_TYPES[ext] && !allowedMime.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type for ${file.name}. Only WEBP, AVIF, SVG, MP4 and WEBM are allowed.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: `${file.name} is larger than 1 GB.` }, { status: 400 });
      }
    }

    const uploaded = await Promise.all(
      files.map(async (file) => {
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        const contentType = allowedMime.includes(file.type) ? file.type : ALLOWED_TYPES[ext];
        const buffer = Buffer.from(await file.arrayBuffer());
        const safeName = file.name
          .toLowerCase()
          .replace(/[^a-z0-9._-]+/g, "-")
          .replace(/-+/g, "-");
        const key = `${PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safeName}`;

        await client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            CacheControl: "public, max-age=31536000, immutable",
          })
        );

        return { key, url: `${publicUrl}/${key}`, size: buffer.length, contentType };
      })
    );

    return NextResponse.json({ uploaded });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { client, bucket, publicUrl } = getR2();
    const body = await req.json().catch(() => ({}));
    const urls: unknown[] = Array.isArray(body.urls) ? body.urls : body.url ? [body.url] : [];

    if (urls.length === 0) {
      return NextResponse.json({ error: "URL or URLs array is required" }, { status: 400 });
    }

    const keys: string[] = [];
    for (const url of urls) {
      const key =
        typeof url === "string" && url.startsWith(`${publicUrl}/`)
          ? decodeURIComponent(url.slice(publicUrl.length + 1))
          : "";
      // Only website media may be deleted here; other bucket folders belong to the backend CMS
      if (!key.startsWith(PREFIX) || key === PREFIX || key.includes("..")) {
        return NextResponse.json({ error: `Invalid URL: ${String(url)}` }, { status: 400 });
      }
      keys.push(key);
    }

    const result = await client.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: { Objects: keys.map((Key) => ({ Key })), Quiet: false },
      })
    );

    if (result.Errors?.length) {
      return NextResponse.json(
        {
          error: "Some files could not be deleted",
          failed: result.Errors.map((e) => ({ key: e.Key, message: e.Message })),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, deletedCount: keys.length });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
