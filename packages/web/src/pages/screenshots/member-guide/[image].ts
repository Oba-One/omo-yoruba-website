import type { APIRoute } from 'astro';

// Keep the screenshots beside the Markdown source and serve the same files in Studio.
const images = import.meta.glob<string>('../../../../../../docs/screenshots/member-guide/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});
const assets = new Map(Object.entries(images).map(([path, url]) => [path.split('/').at(-1), url]));

export const GET: APIRoute = ({ params, url }) => {
  const asset = assets.get(params.image);
  return asset
    ? Response.redirect(new URL(asset, url), 302)
    : new Response('Screenshot not found.', { status: 404 });
};
