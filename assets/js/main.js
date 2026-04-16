/**
 * main.js
 * Handle common UI components (Header, Footer) and interactions (Mobile menu).
 * Supports both Japanese (/) and English (/en/) pages automatically based on URL.
 */

const SITE_NAME_JA = "東北医科薬科大学病院 腫瘍内科";
const SITE_NAME_EN = "Dept. of Medical Oncology, TMPU Hospital";

const NAVIGATION_LINKS_JA = [
    { label: "ホーム", path: "index.html" },
    { label: "医局紹介", path: "about.html" },
    { label: "患者さんへ", path: "patients.html" },
    { label: "医療機関の方へ", path: "referral.html" },
    { label: "研究・業績", path: "research.html" },
    { label: "見学・キャリア", path: "recruit.html" },
    { label: "医師・スタッフ", path: "members.html" },
    { label: "お知らせ", path: "news.html" },
    { label: "コラム", path: "column/index.html" },
];

const NAVIGATION_LINKS_EN = [
    { label: "Home", path: "index.html" },
    { label: "About Us", path: "about.html" },
    { label: "For Patients", path: "patients.html" },
    { label: "Referrals", path: "referral.html" },
    { label: "Research", path: "research.html" },
    { label: "Education", path: "recruit.html" },
    { label: "Staff", path: "members.html" },
    { label: "News", path: "news.html" },
];



function isEnglish() {
    return window.location.pathname.includes('/en/');
}

function getPageName() {
    let path = window.location.pathname;
    let page = path.split("/").pop();
    if (page === "" || page === "index.html") return "index.html";
    return page;
}

function getBaseUrl() {
    const isLocal = window.location.protocol === 'file:';
    if (isLocal) {
        // Find the index of oncology-website
        const pathParts = window.location.pathname.split('/');
        const pIndex = pathParts.indexOf('oncology-website');
        if (pIndex !== -1) {
            return pathParts.slice(0, pIndex + 1).join('/') + '/';
        }
    }
    return isEnglish() ? '../' : './';
}

/**
 * Returns the prefix needed to reach the site root from the current page.
 * - Root pages (/, /index.html, etc.)  → "./"
 * - /en/ pages                         → "../"
 * - /column/ or other subdirs          → "../"
 * Extend the subdirPatterns array when new subdirectories are added.
 */
function getSitePrefix() {
    const pathname = window.location.pathname;
    const subdirPatterns = ['/column/'];
    if (isEnglish()) return '../';
    if (subdirPatterns.some(p => pathname.includes(p))) return '../';
    return './';
}

function renderHeader() {
    const isEn = isEnglish();
    const currentPage = getPageName();
    const links = isEn ? NAVIGATION_LINKS_EN : NAVIGATION_LINKS_JA;
    const siteName = isEn ? SITE_NAME_EN : SITE_NAME_JA;
    const contactText = isEn ? "Contact Us" : "お問い合わせ";
    const subTitle = isEn ? "Tohoku Medical and Pharmaceutical Univ. Hospital" : "東北医科薬科大学病院";
    const mainTitle = isEn ? "Medical Oncology" : "腫瘍内科";
    
    // Path resolution
    const prefix = getSitePrefix();
    const logoFile = isEn ? "Logo EN.png" : "Logo JP.png";
    
    // Lang toggle URLs
    // Pages in subdirectories (e.g. /column/) have no English equivalent.
    // Detect this so we can redirect to EN homepage instead of a broken URL.
    const isSubdirPage = !isEn && window.location.pathname.includes('/column/');
    const jaUrl = isEn ? `../${currentPage}` : `#`;
    const enUrl = isEn ? `#` : isSubdirPage ? `${prefix}en/index.html` : `en/${currentPage}`;

    // Desktop Navigation
    const desktopNav = links.map(link => {
        const isActive = currentPage === link.path;
        return `
            <a href="${prefix}${isEn ? 'en/' : ''}${link.path}" class="text-sm font-bold transition-colors duration-200 
                ${isActive ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-gray-700 hover:text-emerald-800'} py-2 whitespace-nowrap">
                ${link.label}
            </a>
        `;
    }).join("");

    // Mobile Navigation
    const mobileNav = links.map(link => {
        const isActive = currentPage === link.path;
        return `
            <a href="${prefix}${isEn ? 'en/' : ''}${link.path}" class="block px-3 py-3 rounded-md text-base font-bold transition-colors
                ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-800'}">
                ${link.label}
            </a>
        `;
    }).join("");

    const headerHTML = `
        <header id="main-header" class="bg-white sticky top-0 z-50 border-b border-gray-100 transition-shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-3 md:py-4 min-h-[5rem] gap-4">
                    <!-- Logo / Site Name -->
                    <div class="flex-shrink flex items-center min-w-0">
                        <a href="${prefix}${isEn ? 'en/' : ''}index.html" class="flex items-center">
                            <img src="${prefix}assets/images/${logoFile}" alt="${siteName}" class="max-h-14 md:max-h-16 xl:max-h-20 w-auto object-contain max-w-full">
                        </a>
                    </div>
                    
                    <!-- Desktop Menu -->
                    <nav class="hidden xl:flex xl:gap-4 xl:items-center flex-shrink-0">
                        ${desktopNav}
                        <div class="flex items-center gap-3 ml-2 border-l border-gray-200 pl-4">
                            <!-- Language Toggle -->
                            <div class="flex items-center bg-gray-100 rounded-full p-1 text-xs font-bold font-sans">
                                <a href="${jaUrl}" class="px-3 py-1.5 rounded-full ${!isEn ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}">JP</a>
                                <a href="${enUrl}" class="px-3 py-1.5 rounded-full ${isEn ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}">EN</a>
                            </div>

                            <!-- Contact Button -->
                            <a href="${prefix}${isEn ? 'en/' : ''}contact.html" class="px-5 py-2 bg-emerald-800 text-white text-sm font-bold rounded hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap">
                                <i data-lucide="mail" class="w-4 h-4"></i> ${contactText}
                            </a>
                        </div>
                    </nav>

                    <!-- Mobile Menu Button -->
                    <div class="flex items-center xl:hidden gap-2 sm:gap-3 flex-shrink-0">
                        <div class="flex items-center bg-gray-100 rounded-full p-1 text-xs font-bold font-sans">
                            <a href="${jaUrl}" class="px-2 py-1.5 rounded-full ${!isEn ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500'}">JP</a>
                            <a href="${enUrl}" class="px-2 py-1.5 rounded-full ${isEn ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500'}">EN</a>
                        </div>
                        <button type="button" id="mobile-menu-toggle" class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-emerald-800 hover:bg-gray-100 focus:outline-none">
                            <i data-lucide="menu" class="w-6 h-6"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div class="xl:hidden hidden border-t border-gray-100 bg-white" id="mobile-menu">
                <div class="px-2 pt-2 pb-4 space-y-1 shadow-inner">
                    ${mobileNav}
                    <div class="pt-4 mt-4 border-t border-gray-100">
                        <a href="${prefix}${isEn ? 'en/' : ''}contact.html" class="block w-full text-center px-4 py-3 bg-emerald-800 text-white rounded-md font-bold text-base hover:bg-emerald-700 transition-colors">
                            ${contactText}
                        </a>
                    </div>
                </div>
            </div>
        </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (toggleBtn && mobileMenu) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            toggleBtn.innerHTML = `<i data-lucide="${isHidden ? 'x' : 'menu'}" class="w-6 h-6"></i>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }

    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 10) {
            header.classList.add('scrolled-header');
        } else {
            header.classList.remove('scrolled-header');
        }
    });
}

function renderFooter() {
    const isEn = isEnglish();
    const prefix = getSitePrefix();
    const year = new Date().getFullYear();
    
    const fTitle = isEn ? "Dept. of Medical Oncology" : "腫瘍内科";
    const fSub = isEn ? "Tohoku Medical and Pharmaceutical University Hospital" : "東北医科薬科大学病院";
    const fAdd = isEn ? "1-12-1 Fukumuro, Miyagino-ku, Sendai, Miyagi 983-8512, Japan" : "〒983-8512<br>宮城県仙台市宮城野区福室1丁目12-1";
    const fTel = isEn ? "+81-22-259-1221" : "022-259-1221（代表）";
    const fLinks = isEn ? NAVIGATION_LINKS_EN : NAVIGATION_LINKS_JA;

    const footerHTML = `
        <footer class="bg-primary text-white pt-16 pb-8 border-t border-emerald-700">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div class="lg:col-span-1">
                        <div class="flex items-start gap-3 mb-6">
                            <div class="flex flex-col">
                                <span class="text-xs text-emerald-100 font-bold mb-1">${fSub}</span>
                                <span class="text-xl font-bold text-white tracking-tight mb-3">${fTitle}</span>
                                <div class="flex items-center gap-2" role="list" aria-label="${isEn ? 'Social media links' : 'SNSリンク'}">
                                    <a href="https://www.facebook.com/medoncoltmpu/" target="_blank" rel="noopener noreferrer"
                                       aria-label="${isEn ? 'Official Facebook Page (opens in new tab)' : '公式Facebookページ（新しいタブで開きます）'}"
                                       class="sns-icon-link" role="listitem">
                                        <img src="${prefix}assets/images/facebook-logo.svg" alt="Facebook" class="sns-icon">
                                    </a>
                                    <a href="https://www.instagram.com/tmpu_oncology/" target="_blank" rel="noopener noreferrer"
                                       aria-label="${isEn ? 'Official Instagram Account (opens in new tab)' : '公式Instagramアカウント（新しいタブで開きます）'}"
                                       class="sns-icon-link" role="listitem">
                                        <img src="${prefix}assets/images/instagram-logo.svg" alt="Instagram" class="sns-icon">
                                    </a>
                                </div>
                            </div>
                        </div>
                        <ul class="space-y-3 text-emerald-50 text-sm">
                            <li class="flex items-start gap-3">
                                <i data-lucide="map-pin" class="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5"></i>
                                <span>${fAdd}</span>
                            </li>
                            <li class="flex items-center gap-3">
                                <i data-lucide="phone" class="w-5 h-5 text-emerald-300 flex-shrink-0"></i>
                                <span>${fTel}</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-emerald-600 pb-2">${isEn ? "Patients & Referrals" : "受診・連携"}</h3>
                        <ul class="space-y-3">
                            <li><a href="${prefix}${isEn ? 'en/' : ''}patients.html" class="text-emerald-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> ${isEn ? "For Patients" : "患者さんへ"}</a></li>
                            <li><a href="${prefix}${isEn ? 'en/' : ''}referral.html" class="text-emerald-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> ${isEn ? "For Referring Providers" : "医療機関の方へ"}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-emerald-600 pb-2">${isEn ? "About Us & Education" : "医局・採用"}</h3>
                        <ul class="space-y-3">
                            <li><a href="${prefix}${isEn ? 'en/' : ''}about.html" class="text-emerald-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> ${isEn ? "About Us" : "医局紹介"}</a></li>
                            <li><a href="${prefix}${isEn ? 'en/' : ''}members.html" class="text-emerald-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> ${isEn ? "Staff" : "医師・スタッフ紹介"}</a></li>
                            <li><a href="${prefix}${isEn ? 'en/' : ''}recruit.html" class="text-emerald-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> ${isEn ? "Observation / Career" : "見学・キャリア"}</a></li>
                            <li><a href="${prefix}${isEn ? 'en/' : ''}research.html" class="text-emerald-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> ${isEn ? "Research & Publications" : "研究・業績"}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-emerald-600 pb-2">${isEn ? "Information" : "インフォメーション"}</h3>
                        <ul class="space-y-3">
                            <li><a href="${prefix}${isEn ? 'en/' : ''}news.html" class="text-emerald-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> ${isEn ? "News & Events" : "お知らせ"}</a></li>
                            <li><a href="${prefix}${isEn ? 'en/' : ''}contact.html" class="text-emerald-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> ${isEn ? "Contact Us" : "お問い合わせ"}</a></li>
                        </ul>
                    </div>
                </div>

                <div class="pt-8 border-t border-emerald-700 text-center md:flex md:justify-between md:text-left">
                    <p class="text-emerald-200 text-sm mb-4 md:mb-0">
                        &copy; ${year} ${fTitle}, ${fSub}
                    </p>
                    <div class="flex justify-center space-x-6">
                        <a href="https://www.hosp.tohoku-mpu.ac.jp/" target="_blank" class="text-emerald-200 hover:text-white text-sm transition-colors font-bold">${isEn ? "TMPU Hospital Official" : "東北医科薬科大学病院 公式サイト"} <i data-lucide="external-link" class="w-3 h-3 inline"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    
    // Global Watermark removed per user request

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // IntersectionObserver for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-fade-up').forEach(el => {
        observer.observe(el);
    });
});
