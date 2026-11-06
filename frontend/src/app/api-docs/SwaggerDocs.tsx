"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Swagger UI touches window/document on load, so it can't be prerendered
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <p className="p-8 text-sm text-gray-500">Loading API docs…</p>,
});

export function SwaggerDocs() {
  return <SwaggerUI url="/api/openapi" docExpansion="list" tryItOutEnabled />;
}
