import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import {
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
  validateAdminPassword,
  createAdminSessionToken,
  verifyAdminSessionToken,
  recordAuditLog,
  getAuditLogs,
  getAdminReviews,
  toggleReviewVerification,
  deleteReviewRecord,
  getAdminDeletionRequests,
  updateDeletionRequestStatus,
  executePermanentAccountPurge,
  lookupPublicDeletionStatus,
  getAdminDashboardStats,
} from "./src/server/adminService";

function getDomainFromReq(req: express.Request): { origin: string; domain: string } {
  const host = (req.headers.host || "").toLowerCase();
  if (host.includes("patgolito.in")) {
    return { origin: "https://patgolito.in", domain: "patgolito.in" };
  }
  return { origin: "https://patgolito.com", domain: "patgolito.com" };
}

function generateRobotsTxt(activeOrigin: string): string {
  return `# Robots.txt for PATGOLITO
# Official Verified Domains:
# Global: https://patgolito.com
# India:  https://patgolito.in
# Operating Entity: Zoago Logistics Solutions Private Limited

User-agent: *
Allow: /
Disallow: /api/

# Google Search, Mobile, and Image Crawlers
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Mobile
Allow: /

User-agent: Googlebot-Image
Allow: /
Allow: /patgolito_logo.png
Allow: /patgolito_logo.webp
Allow: /patgolito_logo.jpg

User-agent: Google-InspectionTool
Allow: /

User-agent: Storebot-Google
Allow: /

# Microsoft Bing Search Crawlers
User-agent: Bingbot
Allow: /

User-agent: msnbot
Allow: /

User-agent: BingPreview
Allow: /

# OpenAI Search & AI Crawlers
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: meta-externalagent
Allow: /

# AI Knowledge Specifications
Allow: /llms.txt
Allow: /llms-full.txt

# Sitemaps for Google Search Console & Microsoft Bing Webmaster Tools
Sitemap: ${activeOrigin}/sitemap.xml
Sitemap: https://patgolito.com/sitemap.xml
Sitemap: https://patgolito.in/sitemap.xml
Sitemap: ${activeOrigin}/sitemap-index.xml
Sitemap: https://patgolito.com/sitemap-index.xml
Sitemap: https://patgolito.in/sitemap-index.xml
`;
}

function generateSitemapXml(origin: string): string {
  const isDotIn = origin.includes("patgolito.in");
  const primaryOrigin = isDotIn ? "https://patgolito.in" : "https://patgolito.com";
  const secondaryOrigin = isDotIn ? "https://patgolito.com" : "https://patgolito.in";
  const today = new Date().toISOString().split("T")[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Homepage on ${primaryOrigin} -->
  <url>
    <loc>${primaryOrigin}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://patgolito.com/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://patgolito.com/" />
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://patgolito.in/" />
    <image:image>
      <image:loc>${primaryOrigin}/patgolito_logo.png</image:loc>
      <image:title>PATGOLITO Transport &amp; Commercial Logistics in Lucknow</image:title>
      <image:caption>Official PATGOLITO brand logo and transport fleet in Lucknow</image:caption>
    </image:image>
  </url>

  <!-- About Page on ${primaryOrigin} -->
  <url>
    <loc>${primaryOrigin}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://patgolito.com/about" />
    <xhtml:link rel="alternate" hreflang="en" href="https://patgolito.com/about" />
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://patgolito.in/about" />
    <image:image>
      <image:loc>${primaryOrigin}/patgolito_logo.png</image:loc>
      <image:title>About PATGOLITO Logistics</image:title>
      <image:caption>Intra-city goods transport and verified commercial fleet</image:caption>
    </image:image>
  </url>

  <!-- Terms of Service on ${primaryOrigin} -->
  <url>
    <loc>${primaryOrigin}/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://patgolito.com/terms" />
    <xhtml:link rel="alternate" hreflang="en" href="https://patgolito.com/terms" />
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://patgolito.in/terms" />
  </url>

  <!-- Privacy Policy on ${primaryOrigin} -->
  <url>
    <loc>${primaryOrigin}/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://patgolito.com/privacy" />
    <xhtml:link rel="alternate" hreflang="en" href="https://patgolito.com/privacy" />
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://patgolito.in/privacy" />
  </url>

  <!-- Account Deletion on ${primaryOrigin} -->
  <url>
    <loc>${primaryOrigin}/delete-account</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://patgolito.com/delete-account" />
    <xhtml:link rel="alternate" hreflang="en" href="https://patgolito.com/delete-account" />
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://patgolito.in/delete-account" />
  </url>

  <!-- Homepage on ${secondaryOrigin} -->
  <url>
    <loc>${secondaryOrigin}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://patgolito.com/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://patgolito.com/" />
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://patgolito.in/" />
    <image:image>
      <image:loc>${secondaryOrigin}/patgolito_logo.png</image:loc>
      <image:title>PATGOLITO Transport &amp; Logistics India</image:title>
      <image:caption>Official PATGOLITO brand logo and transport fleet in Lucknow</image:caption>
    </image:image>
  </url>

  <!-- About Page on ${secondaryOrigin} -->
  <url>
    <loc>${secondaryOrigin}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://patgolito.com/about" />
    <xhtml:link rel="alternate" hreflang="en" href="https://patgolito.com/about" />
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://patgolito.in/about" />
  </url>

  <!-- Terms of Service on ${secondaryOrigin} -->
  <url>
    <loc>${secondaryOrigin}/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://patgolito.com/terms" />
    <xhtml:link rel="alternate" hreflang="en" href="https://patgolito.com/terms" />
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://patgolito.in/terms" />
  </url>

  <!-- Privacy Policy on ${secondaryOrigin} -->
  <url>
    <loc>${secondaryOrigin}/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://patgolito.com/privacy" />
    <xhtml:link rel="alternate" hreflang="en" href="https://patgolito.com/privacy" />
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://patgolito.in/privacy" />
  </url>

  <!-- Account Deletion on ${secondaryOrigin} -->
  <url>
    <loc>${secondaryOrigin}/delete-account</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://patgolito.com/delete-account" />
    <xhtml:link rel="alternate" hreflang="en" href="https://patgolito.com/delete-account" />
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://patgolito.in/delete-account" />
  </url>
</urlset>`;
}

function generateSitemapIndexXml(): string {
  const today = new Date().toISOString().split("T")[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://patgolito.com/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://patgolito.in/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

interface PageMetaConfig {
  tab: "landing" | "about" | "terms" | "privacy" | "delete-account" | "not-found" | "admin";
  title: string;
  description: string;
  path: string;
  status: number;
  breadcrumbLabel: string;
  contentHtml: string;
}

const SSR_PAGES: Record<string, PageMetaConfig> = {
  landing: {
    tab: "landing",
    title: "PATGOLITO - Best Transport & Logistics Company in Lucknow | Verified Porter Alternative",
    description: "PATGOLITO is Lucknow’s premier on-demand goods transport platform and trusted Porter alternative. Book verified Tata Ace, 3-wheeler goods loaders, and loading helpers with upfront fixed pricing.",
    path: "/",
    status: 200,
    breadcrumbLabel: "Home",
    contentHtml: `
      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-semibold mb-6">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Lucknow's #1 Verified Intra-City Logistics Fleet</span>
        </div>
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight max-w-5xl mx-auto">
          PATGOLITO - Best Transport &amp; Logistics Company in Lucknow
        </h1>
        <p class="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto mt-6 leading-relaxed">
          Book verified Tata Ace mini trucks, 3-wheeler goods loaders, and electric cargo vehicles across Lucknow with upfront calibrated distance pricing and zero bargaining. Samaan Aapka, Mehnat Hamari!
        </p>
        <div class="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 max-w-2xl mx-auto mt-6 text-left flex items-center gap-2.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span><strong>PATGOLITO™</strong> is an official registered Indian logistics and goods transport brand operated by <strong>Zoago Logistics Solutions Private Limited</strong> in Lucknow, Uttar Pradesh.</span>
        </div>
        <div class="flex flex-wrap justify-center gap-4 mt-8">
          <a href="tel:9278499882" class="bg-white text-black font-bold px-7 py-3.5 rounded-xl hover:bg-zinc-200 transition text-sm">
            Call Dispatch Hotline: 9278499882
          </a>
          <a href="/#porter-alternative" class="bg-zinc-900 text-emerald-400 border border-zinc-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-zinc-800 transition text-sm">
            Compare Apps
          </a>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-900">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-2xl sm:text-3xl font-black text-white">Commercial Logistics Fleet in Lucknow</h2>
          <p class="text-zinc-400 text-sm mt-2">Verified commercial drivers ready for immediate intra-city goods movement.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h3 class="text-lg font-bold text-white">Tata Ace Mini Truck</h3>
            <p class="text-xs text-emerald-400 font-mono font-semibold mt-1">750 kg Payload Capacity</p>
            <p class="text-sm text-zinc-400 mt-3 leading-relaxed">Ideal for house shifting, office moves, furniture, heavy commercial appliances, and wholesale inventory.</p>
          </div>
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h3 class="text-lg font-bold text-white">Three-Wheeler Goods Loader</h3>
            <p class="text-xs text-emerald-400 font-mono font-semibold mt-1">500 kg Payload Capacity</p>
            <p class="text-sm text-zinc-400 mt-3 leading-relaxed">Popular for hardware shops, timber, plywood, cartons, and agile navigation through busy Lucknow markets.</p>
          </div>
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h3 class="text-lg font-bold text-white">Electric Cargo Loader (E-Loader)</h3>
            <p class="text-xs text-emerald-400 font-mono font-semibold mt-1">350 kg Eco Payload</p>
            <p class="text-sm text-zinc-400 mt-3 leading-relaxed">Zero-emission electric transit for city-center wholesale dispatches, e-commerce deliveries, and FMCG cartons.</p>
          </div>
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h3 class="text-lg font-bold text-white">Two-Wheeler Express</h3>
            <p class="text-xs text-emerald-400 font-mono font-semibold mt-1">20 kg Rapid Courier</p>
            <p class="text-sm text-zinc-400 mt-3 leading-relaxed">Fast express parcel, document, and food packets transit across all Lucknow corridors within minutes.</p>
          </div>
        </div>
      </section>

      <!-- Comparative Matrix Section -->
      <section id="porter-alternative" class="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-900">
        <div class="text-center max-w-3xl mx-auto mb-10">
          <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">The Trusted Alternative to Leading Transport Apps</span>
          <h2 class="text-2xl sm:text-4xl font-black text-white mt-2">Looking for a Reliable Alternative to Leading Transport Apps? Meet PATGOLITO.</h2>
          <p class="text-sm text-zinc-400 mt-3">Upfront road-calibrated fares, guaranteed vehicle dispatches, in-app helpers (+₹300 flat), and local Transport Nagar dispatch phone support at 9278499882.</p>
        </div>
        <div class="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="p-4 bg-zinc-900 rounded-xl space-y-1">
              <p class="font-bold text-emerald-400">01 Zero Driver Bargaining</p>
              <p class="text-zinc-300">100% upfront road fare calculated digitally. What you see is what you pay.</p>
            </div>
            <div class="p-4 bg-zinc-900 rounded-xl space-y-1">
              <p class="font-bold text-emerald-400">02 Guaranteed Vehicle Dispatch</p>
              <p class="text-zinc-300">Verified commercial fleet assigned within 20-40 mins across Lucknow with zero random cancellations.</p>
            </div>
            <div class="p-4 bg-zinc-900 rounded-xl space-y-1">
              <p class="font-bold text-emerald-400">03 Direct Human Dispatch Desk</p>
              <p class="text-zinc-300">Speak directly to Lucknow-based controllers at +91-9278499882 instead of bot queues.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-zinc-900">
        <div class="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12">
          <h2 class="text-2xl sm:text-3xl font-black text-white mb-6">Frequently Asked Questions</h2>
          <div class="space-y-6 text-left">
            <div>
              <h3 class="font-bold text-white text-base">Why is PATGOLITO considered the top alternative to leading transport apps in Lucknow?</h3>
              <p class="text-sm text-zinc-400 mt-1.5 leading-relaxed">Unlike generic transport booking apps where drivers frequently cancel or demand extra cash bargaining on arrival, PATGOLITO provides guaranteed vehicle dispatches, 100% upfront fixed road-calibrated fares with zero spot bargaining, 1-tap helper options (+₹300 flat), and direct Lucknow dispatch hotline support at 9278499882.</p>
            </div>
            <div>
              <h3 class="font-bold text-white text-base">How does vehicle booking work with PATGOLITO in Lucknow?</h3>
              <p class="text-sm text-zinc-400 mt-1.5 leading-relaxed">Select vehicle type, enter pickup and drop addresses, and view upfront calibrated distance pricing with zero bargaining and instant driver assignment.</p>
            </div>
            <div>
              <h3 class="font-bold text-white text-base">In which areas of Lucknow is PATGOLITO available?</h3>
              <p class="text-sm text-zinc-400 mt-1.5 leading-relaxed">Live across all major zones: Gomti Nagar, Transport Nagar, Hazratganj, Aliganj, Indira Nagar, Mahanagar, Ashiyana, Rajajipuram, Jankipuram, and Sushant Golf City.</p>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  about: {
    tab: "about",
    title: "About PATGOLITO - Verified Intra-City Goods Transport & Logistics in Lucknow",
    description: "Learn about PATGOLITO, operated by Zoago Logistics Solutions Private Limited. Intra-city goods transport, verified Tata Ace and 3-wheeler fleet across Lucknow.",
    path: "/about",
    status: 200,
    breadcrumbLabel: "About PATGOLITO",
    contentHtml: `
      <section class="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-semibold mb-4">
            <span>Operating Entity: Zoago Logistics Solutions Private Limited</span>
          </div>
          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">About PATGOLITO Logistics</h1>
          <p class="text-base sm:text-lg text-zinc-300 mt-4 leading-relaxed">
            PATGOLITO is Lucknow’s premier intra-city commercial logistics and vehicle booking network, connecting businesses, retailers, and households with verified commercial drivers.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-3">
            <h2 class="text-xl font-bold text-white">Verified Commercial Fleet</h2>
            <p class="text-sm text-zinc-400 leading-relaxed">Every vehicle partner undergoes rigorous commercial permit inspection, driver KYC verification, and safety vetting before accepting dispatches in Lucknow.</p>
          </div>
          <div class="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-3">
            <h2 class="text-xl font-bold text-white">Transparent Road-Distance Pricing</h2>
            <p class="text-sm text-zinc-400 leading-relaxed">We calculate exact road distance fares dynamically. No hidden charges, no middleman commissions, and no haggling.</p>
          </div>
        </div>
        <div class="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-4">
          <h2 class="text-xl font-bold text-white">Operational Hubs in Lucknow</h2>
          <p class="text-sm text-zinc-400 leading-relaxed">
            Central Logistics Hub: Transport Nagar (TP Nagar), Lucknow, Uttar Pradesh 226012. Supporting operations in Gomti Nagar, Charbagh, Alambagh, and Barabanki.
          </p>
          <div class="pt-2">
            <a href="tel:9278499882" class="text-emerald-400 font-bold text-sm hover:underline">Support &amp; Dispatch Line: +91-9278499882</a>
          </div>
        </div>
      </section>
    `,
  },
  terms: {
    tab: "terms",
    title: "Terms & Conditions - PATGOLITO | Zoago Logistics Solutions Private Limited",
    description: "Official Terms & Conditions of PATGOLITO, operated by Zoago Logistics Solutions Private Limited. Review platform policies, carriage guidelines, and service terms.",
    path: "/terms",
    status: 200,
    breadcrumbLabel: "Terms & Conditions",
    contentHtml: `
      <section class="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-zinc-300 text-sm leading-relaxed">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-semibold mb-4">
            <span>Effective Date: March 2026</span>
          </div>
          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">Terms &amp; Conditions</h1>
          <p class="text-zinc-400 mt-2">Zoago Logistics Solutions Private Limited (Brand: PATGOLITO)</p>
        </div>
        <div class="space-y-6">
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h2 class="text-lg font-bold text-white mb-2">1. Acceptance of Carriage Terms</h2>
            <p>By using PATGOLITO web portals or mobile applications, you accept these Terms &amp; Conditions and agree to comply with all applicable transport and carriage laws of India.</p>
          </div>
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h2 class="text-lg font-bold text-white mb-2">2. Logistics Technology Intermediary</h2>
            <p>PATGOLITO functions as an intermediary platform connecting independent verified vehicle owners with cargo consignors. Trip contracts for goods carriage are governed under the Carriage by Road Act, 2007.</p>
          </div>
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h2 class="text-lg font-bold text-white mb-2">3. Prohibited and Hazardous Goods</h2>
            <p>Carriage of hazardous chemicals, explosive materials, illegal contraband, untaxed goods, or any items prohibited under Indian statutes is strictly banned.</p>
          </div>
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h2 class="text-lg font-bold text-white mb-2">4. Jurisdiction</h2>
            <p>Any dispute arising out of or related to platform operations shall be subject to the exclusive jurisdiction of the competent courts in Lucknow, Uttar Pradesh, India.</p>
          </div>
        </div>
      </section>
    `,
  },
  privacy: {
    tab: "privacy",
    title: "Privacy Policy - PATGOLITO | Zoago Logistics Solutions Private Limited",
    description: "Official Privacy Policy of PATGOLITO, operated by Zoago Logistics Solutions Private Limited. Learn how personal data, bookings, and location information are handled.",
    path: "/privacy",
    status: 200,
    breadcrumbLabel: "Privacy Policy",
    contentHtml: `
      <section class="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-zinc-300 text-sm leading-relaxed">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-semibold mb-4">
            <span>Data Protection Compliance • IT Act 2000</span>
          </div>
          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">Privacy Policy</h1>
          <p class="text-zinc-400 mt-2">Zoago Logistics Solutions Private Limited ("PATGOLITO", "we", "our")</p>
        </div>
        <div class="space-y-6">
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h2 class="text-lg font-bold text-white mb-2">1. Personal Information Collected</h2>
            <p>We collect customer phone numbers, pickup/drop coordinates, delivery instructions, and booking transaction logs strictly necessary to provide on-demand vehicle dispatch services.</p>
          </div>
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h2 class="text-lg font-bold text-white mb-2">2. Geolocation &amp; Live Tracking</h2>
            <p>Live coordinates are utilized solely during active delivery dispatches to calculate accurate trip distance, driver route guidance, and live delivery status.</p>
          </div>
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h2 class="text-lg font-bold text-white mb-2">3. Google Play Data Safety &amp; Account Deletion</h2>
            <p>Users may request complete deletion of account credentials and personal profile records at any time via our <a href="/delete-account" class="text-emerald-400 underline font-semibold">Delete Account Portal</a> or by contacting official@patgolito.com.</p>
          </div>
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h2 class="text-lg font-bold text-white mb-2">4. Grievance Officer Contact</h2>
            <p>For data inquiries or grievance redressal, contact our designated Grievance Officer at official@patgolito.com or support@patgolito.com, or telephone +91-9278499882.</p>
          </div>
        </div>
      </section>
    `,
  },
  "delete-account": {
    tab: "delete-account",
    title: "Delete Your Account - PATGOLITO | Zoago Logistics Solutions Private Limited",
    description: "Request account and data deletion for PATGOLITO per Google Play Store guidelines. Operating entity: Zoago Logistics Solutions Private Limited. Learn what data is deleted, retention periods, and submit request.",
    path: "/delete-account",
    status: 200,
    breadcrumbLabel: "Delete Your Account",
    contentHtml: `
      <section class="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-zinc-300 text-sm leading-relaxed">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-semibold mb-4">
            <span>Google Play Store Data Safety Standard</span>
          </div>
          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">Delete Your PATGOLITO Account</h1>
          <p class="text-zinc-400 mt-2">Zoago Logistics Solutions Private Limited</p>
        </div>
        <div class="space-y-6">
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h2 class="text-lg font-bold text-white mb-2">Data Deletion Policy &amp; Scope</h2>
            <p>Upon request, your user account credentials, stored phone number, personal profile details, and address history are permanently deleted from PATGOLITO production databases within 30 days.</p>
          </div>
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h2 class="text-lg font-bold text-white mb-2">How to Request Deletion</h2>
            <p>Submit your registered phone number directly via this form, or email our privacy compliance team at <a href="mailto:official@patgolito.com?subject=Account%20Deletion%20Request" class="text-emerald-400 underline font-semibold">official@patgolito.com</a>. You will receive an SMS confirmation upon completion.</p>
          </div>
          <div class="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
            <h2 class="text-lg font-bold text-white mb-2">Statutory Financial Record Retention</h2>
            <p>Historical billing invoices, GST tax receipts, and transactional carriage records are retained in compliance with Indian statutory taxation requirements.</p>
          </div>
        </div>
      </section>
    `,
  },
    "not-found": {
    tab: "not-found",
    title: "404 - Delivery Route Not Found | PATGOLITO Transport Logistics",
    description: "The requested delivery dispatch route or page does not exist on PATGOLITO. Return to the dispatch terminal to book verified transport vehicles across Lucknow.",
    path: "/404",
    status: 404,
    breadcrumbLabel: "404 Route Not Found",
    contentHtml: `
      <section class="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 text-xs font-mono font-bold">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Status 404 • Unregistered Transit Route</span>
        </div>
        <h1 class="text-4xl sm:text-6xl font-black text-white">404 - Delivery Route Not Found</h1>
        <p class="text-zinc-400 max-w-xl mx-auto">
          The requested delivery dispatch route or URL path does not exist on PATGOLITO. Return to the dispatch terminal or call our 24/7 Lucknow support line.
        </p>
        <div class="flex flex-wrap justify-center gap-4 pt-4">
          <a href="/" class="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-zinc-200 transition text-sm">Return to Home</a>
          <a href="tel:9278499882" class="bg-zinc-900 text-emerald-400 border border-zinc-800 font-semibold px-6 py-3 rounded-xl hover:bg-zinc-800 transition text-sm">Call Support: 9278499882</a>
        </div>
      </section>
    `,
  },
  patowner: {
    tab: "admin",
    title: "Operations Terminal | PATGOLITO Restricted Admin Portal",
    description: "Restricted administrative operations gate for authorized PATGOLITO platform personnel.",
    path: "/patowner",
    status: 200,
    breadcrumbLabel: "Operations Terminal",
    contentHtml: `
      <section class="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h1 class="text-2xl font-bold text-white">PATGOLITO Operations Terminal</h1>
        <p class="text-xs text-zinc-400">Loading secure administrative operations gate...</p>
      </section>
    `,
  },
};

function resolveTabKey(rawPath: string): string {
  const normalized = rawPath.toLowerCase().trim().replace(/\/+$/, "") || "/";
  if (normalized === "/" || normalized === "/index.html") return "landing";
  if (normalized === "/about" || normalized.startsWith("/about/")) return "about";
  if (normalized === "/terms" || normalized.startsWith("/terms/")) return "terms";
  if (normalized === "/privacy" || normalized.startsWith("/privacy/")) return "privacy";
  if (
    normalized === "/delete-account" ||
    normalized.startsWith("/delete-account/") ||
    normalized === "/delete-your-account" ||
    normalized === "/deleteaccount"
  ) {
    return "delete-account";
  }
  if (
    normalized === "/patowner" ||
    normalized.startsWith("/patowner/") ||
    normalized === "/pat-owner" ||
    normalized.startsWith("/pat-owner/") ||
    normalized === "/admin" ||
    normalized.startsWith("/admin/")
  ) {
    return "patowner";
  }
  if (
    normalized === "/services" ||
    normalized === "/how-it-works" ||
    normalized === "/why-patgolito" ||
    normalized === "/reviews" ||
    normalized === "/business"
  ) {
    return "landing";
  }
  return "not-found";
}

function renderPageHtml(template: string, req: express.Request): { html: string; statusCode: number } {
  const { origin } = getDomainFromReq(req);
  const tabKey = resolveTabKey(req.path);
  const page = SSR_PAGES[tabKey] || SSR_PAGES["not-found"];
  const fullUrl = `${origin}${page.path}`;

  // Breadcrumb Schema
  const breadcrumbItems = [
    { name: "Home", item: `${origin}/` },
  ];
  if (page.tab !== "landing") {
    breadcrumbItems.push({ name: page.breadcrumbLabel, item: fullUrl });
  }

  const breadcrumbListJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${fullUrl}#breadcrumb`,
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  });

  const headerHtml = `
    <header class="w-full bg-black/95 border-b border-zinc-800 text-white py-4 px-4 sm:px-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <a href="/" class="flex items-center shrink-0">
          <picture>
            <source srcset="/patgolito_logo.webp" type="image/webp" />
            <source srcset="/patgolito_logo.png" type="image/png" />
            <img src="/patgolito_logo.png" alt="PATGOLITO - Best Transport &amp; Logistics Company in Lucknow" width="320" height="80" class="h-10 sm:h-12 w-auto object-contain" />
          </picture>
        </a>
        <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-300">
          <a href="/" class="hover:text-white transition">Home</a>
          <a href="/about" class="hover:text-white transition">About</a>
          <a href="/terms" class="hover:text-white transition">Terms</a>
          <a href="/privacy" class="hover:text-white transition">Privacy</a>
          <a href="/delete-account" class="hover:text-white transition">Delete Account</a>
        </nav>
        <div class="flex items-center gap-3">
          <a href="tel:9278499882" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition">
            Call: 9278499882
          </a>
        </div>
      </div>
    </header>
  `;

  const breadcrumbBarHtml = `
    <nav aria-label="Breadcrumb" class="w-full bg-zinc-950 border-b border-zinc-900 py-2.5 px-4 sm:px-6 text-xs text-zinc-400">
      <div class="max-w-7xl mx-auto flex items-center gap-2">
        <a href="/" class="hover:text-white transition">Home</a>
        ${page.tab !== "landing" ? `<span class="text-zinc-600">/</span><span class="text-white font-semibold">${page.breadcrumbLabel}</span>` : ""}
      </div>
    </nav>
  `;

  const footerHtml = `
    <footer class="w-full bg-black border-t border-zinc-800 text-white py-12 px-4 sm:px-6 mt-16 text-xs">
      <div class="max-w-7xl mx-auto space-y-8">
        <div class="flex flex-col md:flex-row items-start justify-between gap-8">
          <div class="space-y-3 max-w-sm">
            <picture>
              <source srcset="/patgolito_logo.webp" type="image/webp" />
              <source srcset="/patgolito_logo.png" type="image/png" />
              <img src="/patgolito_logo.png" alt="PATGOLITO" width="320" height="80" class="h-9 w-auto object-contain" />
            </picture>
            <p class="text-zinc-400 text-xs leading-relaxed">
              Lucknow’s trusted intra-city goods transport platform. Samaan aapka, mehnat hamari.
            </p>
            <p class="text-zinc-500 text-[11px]">
              Zoago Logistics Solutions Private Limited
            </p>
          </div>
          <div class="grid grid-cols-2 gap-8 text-zinc-400">
            <div class="space-y-2">
              <p class="font-bold text-white text-[11px] uppercase tracking-wider">Company</p>
              <ul class="space-y-1.5">
                <li><a href="/about" class="hover:text-white transition">About PATGOLITO</a></li>
                <li><a href="/terms" class="hover:text-white transition">Terms &amp; Conditions</a></li>
                <li><a href="/privacy" class="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/delete-account" class="hover:text-white transition">Delete Account</a></li>
              </ul>
            </div>
            <div class="space-y-2">
              <p class="font-bold text-white text-[11px] uppercase tracking-wider">Dispatch Hub</p>
              <ul class="space-y-1.5">
                <li><a href="tel:9278499882" class="text-emerald-400 font-bold hover:underline">9278499882</a></li>
                <li><a href="mailto:official@patgolito.com" class="hover:text-white transition">official@patgolito.com</a></li>
                <li class="text-zinc-500">Transport Nagar, Lucknow, UP</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <p>© 2026 Zoago Logistics Solutions Private Limited (Brand: PATGOLITO). All rights reserved.</p>
          <div class="flex items-center gap-4">
            <a href="/terms" class="hover:text-zinc-400 transition">Terms</a>
            <a href="/privacy" class="hover:text-zinc-400 transition">Privacy</a>
            <a href="/delete-account" class="hover:text-zinc-400 transition">Delete Account</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  const fullSsrRoot = page.tab === "admin"
    ? `
      <div class="min-h-screen bg-black text-white flex flex-col justify-between antialiased selection:bg-emerald-500 selection:text-black" data-ssr="admin">
        <header class="border-b border-zinc-800/80 bg-zinc-950/60 px-6 py-4 flex items-center justify-between">
          <picture>
            <source srcset="/patgolito_logo.webp" type="image/webp" />
            <source srcset="/patgolito_logo.png" type="image/png" />
            <img src="/patgolito_logo.png" alt="PATGOLITO" width="180" height="50" class="h-8 sm:h-9 w-auto object-contain" />
          </picture>
          <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Restricted Admin Portal • Lucknow Terminal</span>
          </div>
        </header>
        <main class="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div class="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-4">
            <div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 mx-auto">
              <svg class="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </div>
            <h1 class="text-xl font-bold tracking-tight text-white">Operations Terminal</h1>
            <p class="text-xs text-zinc-400 font-mono">Initializing encrypted administrative gateway...</p>
          </div>
        </main>
        <footer class="border-t border-zinc-900 py-4 px-6 text-center text-zinc-600 text-[11px] font-mono">
          Zoago Logistics Solutions Private Limited • Operations Terminal
        </footer>
      </div>
    `
    : `
      <div class="min-h-screen bg-black text-white flex flex-col justify-between antialiased" data-ssr="true">
        <div>
          ${headerHtml}
          ${breadcrumbBarHtml}
          <main id="main-content">
            ${page.contentHtml}
          </main>
        </div>
        ${footerHtml}
      </div>
    `;

  let rendered = template;

  // Title
  rendered = rendered.replace(/<title>[\s\S]*?<\/title>/i, `<title>${page.title}</title>`);

  // Meta title & description
  rendered = rendered.replace(
    /<meta\s+name=["']title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="title" content="${page.title}" />`
  );
  rendered = rendered.replace(
    /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="description" content="${page.description}" />`
  );

  // Canonical tag
  rendered = rendered.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s+id=["']canonical-url["']\s*\/?>/i,
    `<link rel="canonical" href="${fullUrl}" id="canonical-url" />`
  );

  // Open Graph meta tags
  rendered = rendered.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:title" content="${page.title}" />`
  );
  rendered = rendered.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:description" content="${page.description}" />`
  );
  rendered = rendered.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:url" content="${fullUrl}" />`
  );

  // Twitter meta tags
  rendered = rendered.replace(
    /<meta\s+property=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="twitter:title" content="${page.title}" />`
  );
  rendered = rendered.replace(
    /<meta\s+property=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="twitter:description" content="${page.description}" />`
  );
  rendered = rendered.replace(
    /<meta\s+property=["']twitter:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="twitter:url" content="${fullUrl}" />`
  );

  // Inject Breadcrumb JSON-LD
  rendered = rendered.replace(
    "</head>",
    `  <script type="application/ld+json">${breadcrumbListJson}</script>\n  </head>`
  );

  // Special security rule: The admin gate is strictly unindexed
  if (tabKey === "patowner") {
    rendered = rendered.replace(
      /<meta\s+name=["']robots["'][\s\S]*?\/?>/i,
      '<meta name="robots" content="noindex, nofollow" />'
    );
    rendered = rendered.replace(
      /<meta\s+name=["']googlebot["'][\s\S]*?\/?>/i,
      '<meta name="googlebot" content="noindex, nofollow" />'
    );
    rendered = rendered.replace(
      /<meta\s+name=["']bingbot["'][\s\S]*?\/?>/i,
      '<meta name="bingbot" content="noindex, nofollow" />'
    );
  }

  // Domain adapt for patgolito.in
  if (origin === "https://patgolito.in") {
    rendered = rendered
      .replace(/https:\/\/patgolito\.com\//g, "https://patgolito.in/")
      .replace(/https:\/\/patgolito\.com/g, "https://patgolito.in");
  }

  // Inject SSR Content inside <div id="root">...</div>
  const rootStart = rendered.indexOf('<div id="root">');
  const scriptStart = rendered.indexOf('<script type="module" src="/src/main.tsx"></script>');
  if (rootStart !== -1 && scriptStart !== -1) {
    rendered = rendered.slice(0, rootStart) + `<div id="root">${fullSsrRoot}</div>\n    ` + rendered.slice(scriptStart);
  } else {
    rendered = rendered.replace('<div id="root"></div>', `<div id="root">${fullSsrRoot}</div>`);
  }

  return { html: rendered, statusCode: page.status };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Technical SEO & Security Headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Permissions-Policy", "geolocation=(self), camera=(), microphone=()");
    next();
  });

  app.use(express.json());

  // API Endpoint: /api/maps/route
  // Free Open-Source Routing Machine (OSRM) + geometric fallback (No Google API key required)
  app.post("/api/maps/route", async (req, res) => {
    try {
      const { origin, destination, waypoints } = req.body;

      if (!origin || !destination || origin.lat === undefined || destination.lat === undefined) {
        return res.status(400).json({ error: "Missing origin or destination coordinates." });
      }

      const validWaypoints = (waypoints || []).filter(
        (wp: { lat: number; lng: number }) =>
          wp.lat !== null && wp.lng !== null && !isNaN(wp.lat) && !isNaN(wp.lng)
      );

      let coordsString = `${origin.lng},${origin.lat}`;
      validWaypoints.forEach((wp: { lat: number; lng: number }) => {
        coordsString += `;${wp.lng},${wp.lat}`;
      });
      coordsString += `;${destination.lng},${destination.lat}`;

      try {
        const osrmResponse = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`,
          { headers: { "User-Agent": "PATGOLITO-Logistics/1.0" } }
        );

        if (osrmResponse.ok) {
          const osrmData = await osrmResponse.json();
          const route = osrmData.routes?.[0];

          if (route && route.distance !== undefined) {
            const distanceMeters = Math.round(route.distance);
            const distanceKm = Math.max(1.0, Math.round((distanceMeters / 1000) * 10) / 10);
            const durationSeconds = Math.round(route.duration || (distanceKm * 180));
            const durationMinutes = Math.max(5, Math.round(durationSeconds / 60));

            const polylinePath: Array<{ lat: number; lng: number }> = [];
            if (route.geometry?.coordinates && Array.isArray(route.geometry.coordinates)) {
              route.geometry.coordinates.forEach((coord: [number, number]) => {
                polylinePath.push({ lat: coord[1], lng: coord[0] });
              });
            }

            return res.json({
              source: "osrm_free",
              distanceMeters,
              distanceKm,
              durationSeconds,
              durationMinutes,
              polylinePath: polylinePath.length > 0 ? polylinePath : undefined,
            });
          }
        }
      } catch (osrmErr) {
        console.warn("OSRM free route query failed, using geometric fallback:", osrmErr);
      }

      // Mathematical road-distance fallback
      const distKm = calculateServerHaversine(origin, destination);
      const distanceMeters = Math.round(distKm * 1000);
      const durationSeconds = Math.round(distKm * 180);

      return res.json({
        source: "road_fallback",
        distanceMeters,
        distanceKm: distKm,
        durationSeconds,
        durationMinutes: Math.max(5, Math.round(durationSeconds / 60)),
      });
    } catch (err: any) {
      console.error("Error in /api/maps/route endpoint:", err);
      return res.status(500).json({ error: "Internal server error calculating route." });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Client IP extraction helper
  const getClientIp = (req: express.Request): string => {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
    return req.socket.remoteAddress || "127.0.0.1";
  };

  // Secure admin authentication middleware
  const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization || (req.headers["x-admin-token"] as string);
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    const result = verifyAdminSessionToken(token);
    if (!result.valid || !result.admin) {
      return res.status(401).json({ error: result.error || "Unauthorized administrative access." });
    }

    (req as any).admin = result.admin;
    next();
  };

  // 1. Admin Login (Password authentication with rate limiting & audit log)
  app.post("/api/admin/login", async (req, res) => {
    try {
      const ip = getClientIp(req);
      const rateLimit = checkLoginRateLimit(ip);

      if (!rateLimit.allowed) {
        return res.status(429).json({
          error: `Terminal locked for security due to multiple failed attempts. Please retry in ${rateLimit.retryAfterSeconds} seconds.`,
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        });
      }

      const password = req.body?.password || req.body?.passphrase;
      const result = validateAdminPassword(password);

      if (!result.valid || !result.admin) {
        recordFailedLogin(ip);
        await recordAuditLog({
          adminUser: "UNKNOWN_ATTEMPT",
          action: "ADMIN_LOGIN_FAILED",
          details: `Failed authentication attempt from IP ${ip}`,
          ip,
        });

        const updatedRate = checkLoginRateLimit(ip);
        return res.status(401).json({
          error: "Invalid administrator password.",
          remainingAttempts: updatedRate.remaining,
        });
      }

      resetLoginAttempts(ip);
      const token = createAdminSessionToken(result.admin);

      await recordAuditLog({
        adminUser: result.admin.name,
        action: "ADMIN_LOGIN_SUCCESS",
        details: `Administrator logged into operations terminal from IP ${ip}`,
        ip,
      });

      return res.json({
        success: true,
        token,
        admin: result.admin,
      });
    } catch (err: any) {
      console.error("Admin login error:", err);
      return res.status(500).json({ error: "Internal server error during authentication." });
    }
  });

  // 2. Admin Session Verification
  app.get("/api/admin/session", requireAdminAuth, (req, res) => {
    return res.json({
      authenticated: true,
      admin: (req as any).admin,
    });
  });

  // 3. Admin Logout
  app.post("/api/admin/logout", requireAdminAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const ip = getClientIp(req);
      await recordAuditLog({
        adminUser: admin.name,
        action: "ADMIN_LOGOUT",
        details: `Administrator signed out of operations terminal`,
        ip,
      });
      return res.json({ success: true });
    } catch {
      return res.status(500).json({ error: "Error recording logout." });
    }
  });

  // 4. Admin Dashboard Real-Time Stats
  app.get("/api/admin/stats", requireAdminAuth, async (req, res) => {
    try {
      const stats = await getAdminDashboardStats();
      return res.json(stats);
    } catch (err: any) {
      console.error("Admin stats fetch error:", err);
      return res.status(500).json({ error: "Failed to compute real-time statistics." });
    }
  });

  // 5. Reviews Management: List with pagination, filters, sorting
  app.get("/api/admin/reviews", requireAdminAuth, async (req, res) => {
    try {
      const search = (req.query.search as string) || "";
      const rating = req.query.rating ? Number(req.query.rating) : undefined;
      const verified = req.query.verified !== undefined ? req.query.verified === "true" : undefined;
      const sortBy = (req.query.sortBy as any) || "newest";
      const page = req.query.page ? Number(req.query.page) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;

      const data = await getAdminReviews({ search, rating, verified, sortBy, page, pageSize });
      return res.json(data);
    } catch (err: any) {
      console.error("Admin reviews error:", err);
      return res.status(500).json({ error: "Failed to load reviews." });
    }
  });

  // 6. Reviews Management: Toggle Verification
  app.patch("/api/admin/reviews/:id/verify", requireAdminAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const ip = getClientIp(req);
      const { verified } = req.body;
      const result = await toggleReviewVerification(req.params.id, Boolean(verified), admin.name, ip);
      if (!result.success) return res.status(400).json({ error: result.error });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to update review verification." });
    }
  });

  // 7. Reviews Management: Delete Review
  app.delete("/api/admin/reviews/:id", requireAdminAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const ip = getClientIp(req);
      const result = await deleteReviewRecord(req.params.id, admin.name, ip);
      if (!result.success) return res.status(400).json({ error: result.error });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to delete review." });
    }
  });

  // 8. Account Deletion Requests: List with filters & pagination
  app.get("/api/admin/deletion-requests", requireAdminAuth, async (req, res) => {
    try {
      const search = (req.query.search as string) || "";
      const status = (req.query.status as string) || "all";
      const sortBy = (req.query.sortBy as any) || "newest";
      const page = req.query.page ? Number(req.query.page) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;

      const data = await getAdminDeletionRequests({ search, status, sortBy, page, pageSize });
      return res.json(data);
    } catch (err: any) {
      console.error("Admin deletion requests error:", err);
      return res.status(500).json({ error: "Failed to load deletion requests." });
    }
  });

  // 9. Account Deletion Requests: Update Status & Notes
  app.patch("/api/admin/deletion-requests/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const ip = getClientIp(req);
      const { status, adminNotes } = req.body;
      const result = await updateDeletionRequestStatus(req.params.id, status, adminNotes, admin.name, ip);
      if (!result.success) return res.status(400).json({ error: result.error });
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to update deletion request status." });
    }
  });

  // 10. Account Deletion Requests: Execute Permanent Purge
  app.post("/api/admin/deletion-requests/:id/execute-purge", requireAdminAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const ip = getClientIp(req);
      const result = await executePermanentAccountPurge(req.params.id, admin.name, ip);
      if (!result.success) {
        return res.status(500).json({ error: result.error || "Purge operation failed" });
      }
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Failed to execute purge operation." });
    }
  });

  // 11. Admin Audit Logs
  app.get("/api/admin/audit-logs", requireAdminAuth, async (req, res) => {
    try {
      const limitCount = req.query.limit ? Number(req.query.limit) : 50;
      const logs = await getAuditLogs(limitCount);
      return res.json({ logs });
    } catch {
      return res.status(500).json({ error: "Failed to load audit logs." });
    }
  });

  // 12. Public Sanitized Deletion Status Lookup (No PII leakage)
  app.get("/api/deletion-requests/status", async (req, res) => {
    try {
      const queryText = (req.query.query as string) || "";
      const result = await lookupPublicDeletionStatus(queryText);
      return res.json(result);
    } catch {
      return res.status(500).json({ error: "Failed to lookup deletion status." });
    }
  });

  // Explicit SEO routes for robots.txt, sitemaps (supports both patgolito.com and patgolito.in)
  app.get("/robots.txt", (req, res) => {
    const { origin } = getDomainFromReq(req);
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.type("text/plain; charset=utf-8").send(generateRobotsTxt(origin));
  });

  // Dynamic /sitemap.xml automatically adapts to the requesting domain
  app.get("/sitemap.xml", (req, res) => {
    const { origin } = getDomainFromReq(req);
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.type("application/xml; charset=utf-8").send(generateSitemapXml(origin));
  });

  // Explicit domain sitemaps
  app.get("/sitemap-in.xml", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.type("application/xml; charset=utf-8").send(generateSitemapXml("https://patgolito.in"));
  });

  app.get("/sitemap-com.xml", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.type("application/xml; charset=utf-8").send(generateSitemapXml("https://patgolito.com"));
  });

  app.get("/sitemap-index.xml", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.type("application/xml; charset=utf-8").send(generateSitemapIndexXml());
  });

  // Dedicated AI LLM Context Specifications (llms.txt standard)
  app.get("/llms.txt", (req, res) => {
    const llmsPath = path.join(process.cwd(), "public", "llms.txt");
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.type("text/markdown; charset=utf-8");
    if (fs.existsSync(llmsPath)) {
      return res.sendFile(llmsPath);
    }
    return res.send("# PATGOLITO\nLucknow Intra-City Goods Transport by Zoago Logistics Solutions Private Limited.");
  });

  app.get("/llms-full.txt", (req, res) => {
    const llmsFullPath = path.join(process.cwd(), "public", "llms-full.txt");
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.type("text/markdown; charset=utf-8");
    if (fs.existsSync(llmsFullPath)) {
      return res.sendFile(llmsFullPath);
    }
    return res.send("# PATGOLITO Full Knowledge\nhttps://patgolito.com");
  });

  // Vite middleware for development with SSR HTML integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      if (req.path.startsWith("/api") || path.extname(req.path)) {
        return next();
      }
      try {
        const rawTemplate = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        const transformedTemplate = await vite.transformIndexHtml(req.originalUrl, rawTemplate);
        const { html, statusCode } = renderPageHtml(transformedTemplate, req);
        res.status(statusCode).type("text/html").send(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { index: false }));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api") || path.extname(req.path)) {
        return next();
      }
      try {
        const distIndexPath = path.join(distPath, "index.html");
        const template = fs.readFileSync(distIndexPath, "utf-8");
        const { html, statusCode } = renderPageHtml(template, req);
        res.status(statusCode).type("text/html").send(html);
      } catch (e: any) {
        next(e);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PATGOLITO Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

function calculateServerHaversine(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  return Math.round(straightKm * 1.3 * 10) / 10;
}

startServer();
