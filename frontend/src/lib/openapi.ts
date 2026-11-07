/**
 * OpenAPI spec for the Next.js route handlers in src/app/api (not the NestJS
 * backend, which has its own Swagger at <backend>/api/docs). Served at
 * /api/openapi and rendered at /api-docs. Add an entry under `paths` when a
 * new route handler is created.
 */
export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "IHDUA Frontend API",
    version: "1.0.0",
    description:
      "Route handlers served by the IHDUA Next.js app. The main CMS, donation and lead APIs live in the NestJS backend and are documented separately in its Swagger UI.",
  },
  servers: [{ url: "/", description: "This Next.js app" }],
  tags: [
    {
      name: "Website Images",
      description:
        "Upload, list and delete website media directly in Cloudflare R2 (website/ folder). No JWT required.",
    },
  ],
  paths: {
    "/api/website-images": {
      get: {
        tags: ["Website Images"],
        summary: "List all website images and videos",
        responses: {
          "200": {
            description: "Every file under website/ in the R2 bucket, except page-owned media in website/impact/",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/WebsiteMedia" },
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/MediaError" },
        },
      },
      post: {
        tags: ["Website Images"],
        summary: "Upload website image(s) or video(s)",
        description:
          "Upload one or more files by adding several 'file' fields to the form. Allowed: .webp, .avif and .svg images, .mp4 and .webm videos. Max 1 GB per file. Copy the returned url into the CMS or code.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                    description: "One or more image or video files to upload",
                  },
                  folder: {
                    type: "string",
                    enum: ["impact"],
                    description:
                      "Optional. 'impact' stores the files under website/impact/ for Our Impact pages; the backend deletes them once no page uses them.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Upload success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    uploaded: {
                      type: "array",
                      items: { $ref: "#/components/schemas/UploadedMedia" },
                    },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/MediaError" },
          "500": { $ref: "#/components/responses/MediaError" },
        },
      },
      delete: {
        tags: ["Website Images"],
        summary: "Delete website image(s)",
        description:
          "Pass a single 'url' or an array of 'urls' (as returned by upload or list). Only files under website/ can be deleted, except page-owned media in website/impact/.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  url: {
                    type: "string",
                    description: "Single URL to delete (optional if urls is provided)",
                  },
                  urls: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of URLs to delete in bulk",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Delete success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    deletedCount: { type: "integer", example: 1 },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/MediaError" },
          "500": { $ref: "#/components/responses/MediaError" },
        },
      },
    },
  },
  components: {
    responses: {
      MediaError: {
        description: "Validation or R2 error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { error: { type: "string" } },
            },
          },
        },
      },
    },
    schemas: {
      WebsiteMedia: {
        type: "object",
        properties: {
          key: { type: "string", example: "website/1762250000000-ab12c-hero.webp" },
          url: { type: "string", format: "uri" },
          size: { type: "integer", description: "Bytes" },
        },
      },
      UploadedMedia: {
        type: "object",
        properties: {
          key: { type: "string" },
          url: { type: "string", format: "uri" },
          size: { type: "integer", description: "Bytes" },
          contentType: { type: "string", example: "image/webp" },
        },
      },
    },
  },
} as const;
