import type { Config } from '@netlify/edge-functions';

export default async function () {
  const html404 =
    '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1></body></html>';

  return new Response(html404, {
    status: 404,
    headers: {
      'Content-Type': 'text/html',
      'netlify-cdn-cache-control': 'durable, immutable, max-age=86400, public',
    },
  });
}

export const config: Config = {
  cache: 'manual',
  pattern:
    '^.*\\.([Pp][Hh][Pp]|[Xx][Mm][Ll]|[Ss][Qq][Ll]|[Yy][Aa]?[Mm][Ll]|[Tt][Xx][Tt])$|^/\\.|^/%2f|^/(etc|backup|server|cloud|config|admin|upload|site|file|_app/pages|_app/assets|wp|images|media|new|old|test|temp|blog).*$|^/_app/?$',
};
