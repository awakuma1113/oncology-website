const NAVIGATION_STYLE = `
<style data-column-navigation-styles>
  .column-page-navigation {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 24px 0 32px;
  }
  .column-page-navigation a {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 12px 20px;
    border-radius: 10px;
    font-family: 'BIZ UDPGothic', 'Noto Sans JP', sans-serif;
    font-weight: 700;
    font-size: 13px;
    line-height: 1.5;
    letter-spacing: 0.04em;
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }
  .column-page-navigation a:hover { transform: translateY(-1px); }
  .column-page-navigation a:focus-visible {
    outline: 3px solid rgba(29, 143, 90, 0.35);
    outline-offset: 3px;
  }
  .column-nav-list {
    color: #ffffff;
    background: #167348;
    border: 1px solid #167348;
    box-shadow: 0 3px 12px rgba(22, 115, 72, 0.18);
  }
  .column-nav-list:hover { background: #115a38; }
  .column-nav-home {
    color: #115a38;
    background: #ffffff;
    border: 1px solid #6cc89a;
  }
  .column-nav-home:hover { background: #f0faf4; }
  @media (min-width: 640px) {
    .column-page-navigation {
      flex-direction: row;
      justify-content: center;
    }
    .column-page-navigation a { min-width: 210px; }
  }
</style>
`;

const NAVIGATION_HTML = `
  <nav class="column-page-navigation" data-column-navigation aria-label="コラムナビゲーション">
    <a href="index.html" class="column-nav-list">← コラム一覧に戻る</a>
    <a href="../index.html" class="column-nav-home">トップページへ戻る</a>
  </nav>
`;

const LEGACY_BUTTON_PATTERN = /\s*<a\b[^>]*>(?:(?!<\/a>)[\s\S])*(?:トップページへ戻る|コラム一覧に戻る)(?:(?!<\/a>)[\s\S])*<\/a>\s*/gi;

function addColumnNavigation(html) {
  if (html.includes('data-column-navigation')) return html;

  let transformed = html.replace(LEGACY_BUTTON_PATTERN, '\n');
  transformed = transformed.replace('</head>', `${NAVIGATION_STYLE}</head>`);

  const insertionMarkers = [
    '<section class="credit-block',
    '<div class="credit-block',
    '<footer class="footer',
    '</body>',
  ];

  for (const marker of insertionMarkers) {
    const position = transformed.indexOf(marker);
    if (position !== -1) {
      return `${transformed.slice(0, position)}${NAVIGATION_HTML}\n${transformed.slice(position)}`;
    }
  }

  return transformed;
}

export default async function handler(request, context) {
  const url = new URL(request.url);
  if (
    request.method !== 'GET' ||
    url.pathname === '/column/' ||
    url.pathname.endsWith('/column/index.html') ||
    !url.pathname.endsWith('.html')
  ) {
    return;
  }

  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || !contentType.toLowerCase().includes('text/html')) {
    return response;
  }

  const originalHtml = await response.text();
  const transformedHtml = addColumnNavigation(originalHtml);
  if (transformedHtml === originalHtml) return response;

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.delete('etag');
  headers.set('content-type', 'text/html; charset=utf-8');

  return new Response(transformedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const config = {
  path: '/column/*',
};

export { addColumnNavigation };
