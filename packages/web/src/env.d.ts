/// <reference types="@sanity/astro/module" />
// The generated query result types register on @sanity/client's SanityQueries, so loadQuery and
// client.fetch return typed results (bun typegen writes the file, ADR 0017).
/// <reference path="../../content/src/sanity.types.ts" />

/** The form bridge the layout installs (packages/web/src/components/FormBridge.astro, ADR 0019). */
interface Window {
  oySubmit?: (
    name: string,
    formData: FormData,
  ) => Promise<{ data?: unknown; error?: { message: string } | null | undefined }>;
}
