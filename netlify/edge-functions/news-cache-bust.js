const TARGET_PATHS = new Set(['/', '/index.html', '/news.html']);
const VERSIONED_NEWS_SCRIPT = 'assets/js/news.js?v=20260714-3';

function addNewsVersion(html) {
  return html.replace(
    /src=["']assets\/js\/news\.js(?:\?[^"']*)?["']/,
    `src="${VERSIONED_NEWS_SCRIPT}"`,
  );
}

export default async function handler(request, context) {
  const url = new URL(request.url);

  if (request.method !== 'GET' || !TARGET_PATHS.has(url.pathname)) {
    return;
  }

  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok || !contentType.toLowerCase().includes('text/html')) {
    return response;
  }

  const originalHtml = await response.text();
  const transformedHtml = addNewsVersion(originalHtml);

  if (transformedHtml === originalHtml) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.delete('etag');
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'no-cache, no-store, must-revalidate');

  return new Response(transformedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const config = {
  path: '/*',
};

export { addNewsVersion };
