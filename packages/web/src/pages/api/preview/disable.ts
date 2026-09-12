import type { APIRoute } from 'astro';
import { disableCookieHeaders } from '../../../lib/sanity/preview';

export const prerender = false;

/** Clears the perspective cookie (the Presentation tool does not call this itself) and goes home. */
export const GET: APIRoute = () => {
  const headers = new Headers({ Location: '/' });
  for (const header of disableCookieHeaders()) headers.append('Set-Cookie', header);
  return new Response(null, { status: 307, headers });
};
