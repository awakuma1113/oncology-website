/**
 * Shared news data and render helpers.
 * Keep article metadata here so the homepage and news index use the same source.
 */
const TMPU_NEWS_ITEMS = [
    {
        date: '2026-07-11',
        category: 'メディア',
        title: '下平秀樹教授がBSテレ東「教えて！ドクター 家族の健康」に出演します',
        url: 'news/20260711-bs-tvtokyo.html',
        status: 'published',
        featured: true,
    },
    {
        date: '2026-06-30',
        category: 'コラム',
        title: 'コラム vol.05「『食べてほしい』と思うご家族へ」を公開しました。',
        url: 'column/07.html',
        status: 'published',
    },
    {
        date: '2026-05-22',
        category: 'コラム',
        title: 'コラム vol.04「肝臓や肺に『がんがある』と言われたときに」を公開しました。',
        url: 'column/06.html',
        status: 'published',
    },
    {
        date: '2026-05-21',
        category: '医療者向け',
        title: '教育コラム vol.02「見逃すな――急速に悪化するirAE」を公開しました。',
        url: 'medical/index.html',
        status: 'published',
    },
    {
        date: '2026-05-21',
        category: '医療者向け',
        title: '教育コラム vol.01「支持療法と有害事象対策」を公開しました。',
        url: 'medical/index.html',
        status: 'published',
    },
    {
        date: '2026-05-20',
        category: 'コラム',
        title: 'コラム vol.03「抗がん剤を『やめる』と言われたときに」を公開しました。',
        url: 'column/03.html',
        status: 'published',
    },
    {
        date: '2026-05-20',
        category: 'コラム',
        title: 'コラム vol.02「がん遺伝子パネル検査を受ける前に」を公開しました。',
        url: 'column/02.html',
        status: 'published',
    },
    {
        date: '2026-04-01',
        category: 'ご案内',
        title: 'ホームページを新設しました。',
        url: 'news.html',
        status: 'published',
    },
];

function parseNewsDate(value) {
    const date = new Date(`${value}T00:00:00+09:00`);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatNewsDate(value) {
    const date = parseNewsDate(value);
    if (!date) return value;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

function getCategoryClasses(category) {
    const classes = {
        '医療者向け': 'bg-sky-100 text-sky-800 border-sky-200',
        'メディア': 'bg-amber-100 text-amber-800 border-amber-200',
        'コラム': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'ご案内': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    return classes[category] || 'bg-emerald-100 text-emerald-800 border-emerald-200';
}

function getPublishedNewsItems(now = new Date()) {
    return TMPU_NEWS_ITEMS
        .map((item, index) => ({ ...item, publishedAt: parseNewsDate(item.date), sourceOrder: index }))
        .filter(item => item.status === 'published' && item.publishedAt && item.publishedAt <= now)
        .sort((a, b) => {
            const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
            if (featuredDiff !== 0) return featuredDiff;
            const dateDiff = b.publishedAt.getTime() - a.publishedAt.getTime();
            if (dateDiff !== 0) return dateDiff;
            return a.sourceOrder - b.sourceOrder;
        });
}

function isNewItem(item, now = new Date()) {
    if (!item.publishedAt) return false;
    const elapsed = now.getTime() - item.publishedAt.getTime();
    const fourteenDays = 14 * 24 * 60 * 60 * 1000;
    return elapsed >= 0 && elapsed <= fourteenDays;
}

function renderLatestNews(container, items) {
    if (items.length === 0) {
        container.innerHTML = '<p class="p-6 text-sm text-gray-600">現在、掲載中のお知らせはありません。</p>';
        return;
    }

    container.innerHTML = items.map(item => `
        <li class="group ${item.featured ? 'bg-amber-50/70' : 'bg-white'}">
            <a href="${item.url}" class="flex flex-col gap-2 p-5 transition-colors hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-700 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
                <div class="flex flex-wrap items-center gap-2 sm:w-56 sm:flex-shrink-0">
                    <time datetime="${item.date}" class="text-sm font-medium text-gray-500 font-mono">${formatNewsDate(item.date)}</time>
                    <span class="px-2.5 py-1 text-xs font-bold rounded border ${getCategoryClasses(item.category)}">${item.category}</span>
                    ${item.featured ? '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500 text-white">PICK UP</span>' : ''}
                    ${isNewItem(item) ? '<span class="px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-50 text-red-700 border border-red-100">NEW</span>' : ''}
                </div>
                <h3 class="flex-1 text-base font-bold leading-relaxed text-gray-900 transition-colors group-hover:text-primary">${item.title}</h3>
                <i data-lucide="chevron-right" class="hidden h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-primary sm:block"></i>
            </a>
        </li>
    `).join('');
}

function renderNewsIndex(container, items) {
    if (items.length === 0) {
        container.innerHTML = '<li class="p-6 text-sm text-gray-600">現在、掲載中のお知らせはありません。</li>';
        return;
    }

    container.innerHTML = items.map(item => `
        <li class="group ${item.featured ? 'bg-amber-50/60' : 'bg-white'}">
            <a href="${item.url}" class="block p-6 transition-colors hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-emerald-700">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div class="flex flex-wrap items-center gap-3 sm:w-56 sm:flex-shrink-0">
                        <time datetime="${item.date}" class="text-sm font-medium text-gray-500 font-mono">${formatNewsDate(item.date)}</time>
                        <span class="px-2.5 py-1 text-xs font-bold rounded border ${getCategoryClasses(item.category)}">${item.category}</span>
                        ${item.featured ? '<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500 text-white">PICK UP</span>' : ''}
                    </div>
                    <div class="flex-grow">
                        <h2 class="text-lg font-bold leading-relaxed text-gray-900 transition-colors group-hover:text-primary">${item.title}</h2>
                    </div>
                    <div class="hidden text-gray-400 group-hover:text-primary sm:block">
                        <i data-lucide="chevron-right" class="h-5 w-5"></i>
                    </div>
                </div>
            </a>
        </li>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const publishedItems = getPublishedNewsItems();
    const latestContainer = document.getElementById('latest-news-list');
    if (latestContainer) renderLatestNews(latestContainer, publishedItems.slice(0, 3));

    const newsIndexContainer = document.getElementById('news-index-list');
    if (newsIndexContainer) renderNewsIndex(newsIndexContainer, publishedItems);
});
