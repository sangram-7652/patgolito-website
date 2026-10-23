/**
 * Technical SEO Management Utility
 * Dynamically updates document title, canonical URLs, meta tags, OpenGraph,
 * Twitter Cards, and structured breadcrumb metadata across SPA navigation.
 */

export type AppPageTab = 'landing' | 'about' | 'terms' | 'privacy' | 'delete-account' | 'not-found' | 'admin';

export interface PageSeoConfig {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  noindex?: boolean;
}

export const SEO_PAGES: Record<AppPageTab, PageSeoConfig> = {
  landing: {
    title: 'PATGOLITO - Best Transport & Logistics Company in Lucknow | Verified Porter Alternative',
    description: 'PATGOLITO is Lucknow’s premier on-demand goods transport platform and top Porter alternative. Book verified Tata Ace, 3-wheeler goods loaders, and loading helpers with upfront fixed pricing.',
    path: '/',
    keywords: 'PATGOLITO, Porter alternative, Porter alternative Lucknow, logistics Lucknow, transport Lucknow, best logistics company Lucknow, mini truck rental Lucknow, Tata Ace hire Lucknow, goods transport Lucknow, house shifting Lucknow, commercial logistics Transport Nagar, Lucknow tempo service, goods delivery Lucknow, transport company in Lucknow, Zoago Logistics Solutions',
  },
  about: {
    title: 'About PATGOLITO - Verified Intra-City Goods Transport & Logistics in Lucknow',
    description: 'Learn about PATGOLITO, operated by Zoago Logistics Solutions Private Limited. Intra-city goods transport, verified Tata Ace and 3-wheeler fleet across Lucknow.',
    path: '/about',
    keywords: 'about PATGOLITO, Zoago Logistics Solutions, Lucknow logistics team, verified drivers Lucknow, commercial transport Lucknow',
  },
  terms: {
    title: 'Terms & Conditions - PATGOLITO | Zoago Logistics Solutions Private Limited',
    description: 'Official Terms & Conditions of PATGOLITO, operated by Zoago Logistics Solutions Private Limited. Review platform policies, carriage guidelines, and service terms.',
    path: '/terms',
    keywords: 'PATGOLITO terms and conditions, Zoago Logistics Solutions Private Limited, transport terms Lucknow, logistics platform terms, carriage policies',
  },
  privacy: {
    title: 'Privacy Policy - PATGOLITO | Zoago Logistics Solutions Private Limited',
    description: 'Official Privacy Policy of PATGOLITO, operated by Zoago Logistics Solutions Private Limited. Learn how personal data, bookings, and location information are handled.',
    path: '/privacy',
    keywords: 'PATGOLITO privacy policy, Zoago Logistics Solutions Private Limited, data protection, logistics customer privacy, booking security Lucknow',
  },
  'delete-account': {
    title: 'Delete Your Account - PATGOLITO | Zoago Logistics Solutions Private Limited',
    description: 'Request account and data deletion for PATGOLITO per Google Play Store guidelines. Operating entity: Zoago Logistics Solutions Private Limited. Learn what data is deleted, retention periods, and submit request.',
    path: '/delete-account',
    keywords: 'PATGOLITO delete account, request data deletion PATGOLITO, Zoago Logistics delete account, Google Play data safety, account deletion portal Lucknow',
  },
  'not-found': {
    title: '404 - Delivery Route Not Found | PATGOLITO Transport Logistics',
    description: 'The requested delivery dispatch route or page does not exist on PATGOLITO. Return to the dispatch terminal to book verified transport vehicles across Lucknow.',
    path: '/404',
  },
  admin: {
    title: 'Operations Terminal | PATGOLITO Restricted Admin Portal',
    description: 'Restricted administrative operations gate for authorized PATGOLITO platform personnel.',
    path: '/patowner',
    noindex: true,
  },
};

export function updatePageSeo(pageKey: AppPageTab): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const config = SEO_PAGES[pageKey] || SEO_PAGES['not-found'];
  const host = window.location.hostname.toLowerCase();
  const isDotIn = host.includes('patgolito.in');
  const baseOrigin = isDotIn ? 'https://patgolito.in' : 'https://patgolito.com';
  const fullUrl = `${baseOrigin}${config.path}`;

  // 1. Update Document Title
  document.title = config.title;

  // 2. Helper to set or update meta tags
  const setMeta = (selector: string, attr: string, value: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const [key, val] = selector.replace(/[\[\]]/g, '').split('=');
      el.setAttribute(key, val.replace(/["']/g, ''));
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  // 3. Primary Meta Tags
  setMeta('meta[name="title"]', 'content', config.title);
  setMeta('meta[name="description"]', 'content', config.description);
  if (config.keywords) {
    setMeta('meta[name="keywords"]', 'content', config.keywords);
  }

  // Robots meta tag: indexable for public pages, strictly protected for private administrative gate
  if (config.noindex) {
    setMeta('meta[name="robots"]', 'content', 'noindex, nofollow');
    setMeta('meta[name="googlebot"]', 'content', 'noindex, nofollow');
    setMeta('meta[name="bingbot"]', 'content', 'noindex, nofollow');
  } else {
    setMeta('meta[name="robots"]', 'content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('meta[name="googlebot"]', 'content', 'index, follow, max-snippet:-1, max-image-preview:large');
    setMeta('meta[name="bingbot"]', 'content', 'index, follow, max-snippet:-1, max-image-preview:large');
  }

  // 4. Canonical & Multi-Domain URLs
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', fullUrl);

  // 5. Open Graph Meta Tags
  setMeta('meta[property="og:title"]', 'content', config.title);
  setMeta('meta[property="og:description"]', 'content', config.description);
  setMeta('meta[property="og:url"]', 'content', fullUrl);

  // 6. Twitter Card Meta Tags
  setMeta('meta[property="twitter:title"]', 'content', config.title);
  setMeta('meta[property="twitter:description"]', 'content', config.description);
  setMeta('meta[property="twitter:url"]', 'content', fullUrl);
}
