// Cloudflare Pages middleware that runs before every asset is served.
//
// For HTML responses on known routes it rewrites the <title>, description,
// og/twitter meta, and canonical link, and injects a hidden #ssr-content
// block before #root containing real <h1> and body copy. This gives
// Googlebot's no-JS first pass actual content per route — without it every
// URL returns the same empty <body><div id="root"></div></body> shell, which
// gets classified as Soft 404 and produces duplicate-content signals.
//
// Non-HTML responses (assets, sitemap.xml, etc.) and unknown routes pass
// through unchanged.

interface Env {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  // Fall back to the Vite-prefixed names if the user copied them as-is into
  // Cloudflare Pages env without renaming.
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

type MiddlewareContext = {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
};

const SITE_ORIGIN = "https://texaspoliticstracker.com";

type RouteMeta = {
  title: string;
  description: string;
  h1: string;
  body: string;
};

const STATIC_ROUTES: Record<string, RouteMeta> = {
  "/": {
    title: "Texas Governor 2026 — Money & Polling Tracker | Texas Politics Tracker",
    description:
      "Follow the money and polling in the 2026 Texas Gubernatorial Race. Live finance data from the Texas Ethics Commission, polling averages, and independent expenditures across all candidates.",
    h1: "Texas Governor 2026 — Follow the Money",
    body: `
      <p>Texas Politics Tracker is a public-interest dashboard for the 2026 Texas Gubernatorial Race. We pull primary-source campaign-finance filings from the Texas Ethics Commission's campaign-finance filings, surface independent-expenditure spending, and aggregate public polling so you can see how money and momentum are moving in the race.</p>
      <p>Updated nightly with the Secretary of State's filings.</p>
      <ul>
        <li><a href="/candidates">All candidates and their funding</a></li>
        <li><a href="/polling">Polling averages</a></li>
        <li><a href="/money/donors">Top donors across the race</a></li>
        <li><a href="/money/outside-spending">Independent expenditures</a></li>
        <li><a href="/about">How this data is collected</a></li>
      </ul>
    `,
  },
  "/candidates": {
    title: "All Candidates — Texas Governor 2026 | Texas Politics Tracker",
    description:
      "Every declared candidate in the 2026 Texas Governor's race, with campaign-finance totals, polling, and biographical detail. Sourced from Texas Ethics Commission filings.",
    h1: "Candidates for Texas Governor, 2026",
    body: `
      <p>This page lists every declared candidate in the 2026 Texas Gubernatorial Race. Each entry shows total contributions, expenditures, current polling average, and links through to a detailed donor and finance profile.</p>
      <p>Filings are pulled nightly from the Texas Ethics Commission's public bulk data.</p>
      <ul>
        <li><a href="/money/donors">Compare top donors across all candidates</a></li>
        <li><a href="/polling">Polling averages</a></li>
        <li><a href="/money/outside-spending">Independent-expenditure spending by committee</a></li>
      </ul>
    `,
  },
  "/polling": {
    title: "Polling — Texas Governor 2026 | Texas Politics Tracker",
    description:
      "Polling averages and individual poll results for the 2026 Texas Gubernatorial Race, aggregated from public sources.",
    h1: "Texas Governor 2026 — Polling",
    body: `
      <p>This page shows the polling picture for the 2026 Texas Governor's race: a rolling polling average across major surveys, individual poll-by-poll results, and trend data over the course of the cycle.</p>
      <p>Polling is sourced from public aggregators and individual published surveys.</p>
      <ul>
        <li><a href="/candidates">Candidate-by-candidate finance and polling</a></li>
        <li><a href="/">Full race overview</a></li>
      </ul>
    `,
  },
  "/money/donors": {
    title: "Top Donors — Texas Governor 2026 | Texas Politics Tracker",
    description:
      "The largest individual and PAC contributors to candidates in the 2026 Texas Governor's race, ranked by total dollars given. Data from the Texas Ethics Commission.",
    h1: "Top Donors — Texas Governor 2026",
    body: `
      <p>This page ranks the largest individual and PAC contributors across all 2026 Texas Gubernatorial candidates. Donors are aggregated by name and recipient committee, with industry and employer where reported.</p>
      <ul>
        <li><a href="/candidates">Candidate finance profiles</a></li>
        <li><a href="/money/outside-spending">Independent-expenditure committees</a></li>
      </ul>
    `,
  },
  "/money/outside-spending": {
    title: "Independent Expenditures — Texas Governor 2026 | Texas Politics Tracker",
    description:
      "Independent expenditures supporting or opposing 2026 Texas Gubernatorial candidates, with committee-level detail and target candidates. Data from the Texas Ethics Commission.",
    h1: "Independent Expenditures — 2026 Texas Governor's Race",
    body: `
      <p>Independent expenditures are spending by committees and groups not coordinated with a candidate's campaign — typically advertising for or against a candidate. This page tracks every IE committee active in the 2026 Texas Governor's race, with totals, target candidates, and individual-expenditure detail.</p>
      <ul>
        <li><a href="/candidates">Candidate finance profiles</a></li>
        <li><a href="/money/donors">Largest contributors to candidates and committees</a></li>
      </ul>
    `,
  },
  "/statewide": {
    title: "Statewide Races — Texas 2026 | Texas Politics Tracker",
    description:
      "Campaign finance for Texas's 2026 down-ballot statewide races — Lt. Governor and Attorney General — from Texas Ethics Commission filings.",
    h1: "Texas Statewide Races, 2026",
    body: `
      <p>Money in Texas's other 2026 statewide executive races: Lt. Governor (Dan Patrick vs. Vikki Goodwin) and Attorney General (Mayes Middleton vs. Nathan Johnson), with per-candidate totals, donors, and filings from the Texas Ethics Commission's daily bulk data.</p>
    `,
  },
  "/about": {
    title: "About & Methodology | Texas Politics Tracker",
    description:
      "How Texas Politics Tracker works — where the campaign-finance data comes from, how polling averages are computed, and the campaign-finance rules for the 2026 Texas Governor's race.",
    h1: "About Texas Politics Tracker",
    body: `
      <p>Texas Politics Tracker is a public-interest dashboard tracking money and polling in the 2026 Texas Gubernatorial Race. This page explains where our data comes from, how it's updated, and what's included.</p>
      <ul>
        <li><a href="/candidates">Candidate finance profiles</a></li>
        <li><a href="/polling">Polling averages</a></li>
      </ul>
    `,
  },
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSupabaseEnv(env: Env): { url: string; key: string } | null {
  const url = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL;
  const key = env.SUPABASE_ANON_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function fetchCandidateMeta(
  env: Env,
  slug: string,
): Promise<RouteMeta | null> {
  const supa = getSupabaseEnv(env);
  if (!supa) return null;

  try {
    const apiUrl = `${supa.url}/rest/v1/ca_candidates?slug=eq.${encodeURIComponent(slug)}&select=name,party,title,bio&limit=1`;
    const r = await fetch(apiUrl, {
      headers: {
        apikey: supa.key,
        Authorization: `Bearer ${supa.key}`,
      },
      // Cloudflare-specific cache hint; safe to ignore in non-CF runtimes.
      cf: { cacheTtl: 300, cacheEverything: true },
    } as RequestInit & { cf?: { cacheTtl?: number; cacheEverything?: boolean } });
    if (!r.ok) return null;
    const rows = (await r.json()) as Array<{
      name: string;
      party: string | null;
      title: string | null;
      bio: string | null;
    }>;
    const c = rows?.[0];
    if (!c) return null;

    const partySuffix = c.party ? ` (${c.party})` : "";
    const role = c.title || "Texas Gubernatorial Candidate";
    const bioFirst = (c.bio ?? "")
      .split(/(?<=[.!?])\s/)
      .slice(0, 2)
      .join(" ")
      .slice(0, 320);

    return {
      title: `${c.name}${partySuffix} — Donors, Finance & Polling | Texas Politics Tracker`,
      description: `${c.name} — campaign finance, top donors, independent expenditures, and polling for the 2026 Texas Governor's race. Sourced from the Texas Ethics Commission.`,
      h1: `${c.name}${partySuffix} — Texas Governor 2026`,
      body: `
        <p>${escapeHtml(role)}. Campaign-finance summary, top individual and PAC donors, independent-expenditure spending for and against, and current polling for the 2026 Texas Governor's race.</p>
        ${bioFirst ? `<p>${escapeHtml(bioFirst)}</p>` : ""}
        <ul>
          <li><a href="/candidates">All candidates</a></li>
          <li><a href="/money/donors">Top donors across the race</a></li>
          <li><a href="/polling">Polling averages</a></li>
          <li><a href="/money/outside-spending">Independent expenditures</a></li>
        </ul>
      `,
    };
  } catch {
    return null;
  }
}

function buildSsrBlock(meta: RouteMeta): string {
  return `<div id="ssr-content" style="display:none" aria-hidden="true">
    <h1>${escapeHtml(meta.h1)}</h1>
    ${meta.body.trim()}
  </div>`;
}

function rewriteHtml(html: string, meta: RouteMeta, canonical: string): string {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);

  let out = html;

  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);

  if (/<meta\s+name=["']description["'][^>]*>/i.test(out)) {
    out = out.replace(
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${description}">`,
    );
  } else {
    out = out.replace(
      /<\/head>/i,
      `  <meta name="description" content="${description}">\n</head>`,
    );
  }

  out = out.replace(
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${title}">`,
  );
  out = out.replace(
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${title}">`,
  );
  out = out.replace(
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${description}">`,
  );
  out = out.replace(
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${description}">`,
  );

  // Add og:url + canonical (idempotent: only if not already present).
  if (!/<link\s+rel=["']canonical["']/i.test(out)) {
    out = out.replace(
      /<\/head>/i,
      `  <meta property="og:url" content="${canonical}">\n  <link rel="canonical" href="${canonical}">\n</head>`,
    );
  }

  out = out.replace(
    /<div\s+id=["']root["']\s*><\/div>/i,
    `${buildSsrBlock(meta)}\n    <div id="root"></div>`,
  );

  return out;
}

function isAssetPath(pathname: string): boolean {
  // Skip files with extensions that aren't HTML (.js, .css, .png, .ico, .webp, etc.)
  const dot = pathname.lastIndexOf(".");
  if (dot < 0) return false;
  const ext = pathname.slice(dot + 1).toLowerCase();
  return ext.length > 0 && ext !== "html" && ext !== "htm";
}

export const onRequest = async (context: MiddlewareContext): Promise<Response> => {
  const { request, env, next } = context;
  if (request.method !== "GET" && request.method !== "HEAD") return next();

  const url = new URL(request.url);

  if (isAssetPath(url.pathname)) return next();

  const response = await next();
  const ct = response.headers.get("content-type") ?? "";
  if (!ct.toLowerCase().includes("text/html")) return response;

  const pathname = url.pathname.replace(/\/+$/, "") || "/";

  // Beta routes mirror public routes; keep them out of the index.
  if (pathname === "/beta" || pathname.startsWith("/beta/")) {
    const html = await response.text();
    const withNoindex = html.replace(
      /<\/head>/i,
      `  <meta name="robots" content="noindex,nofollow">\n</head>`,
    );
    const headers = new Headers(response.headers);
    headers.delete("content-length");
    return new Response(withNoindex, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  let meta: RouteMeta | null = STATIC_ROUTES[pathname] ?? null;
  if (!meta) {
    const candidateMatch = pathname.match(/^\/candidates\/([a-z0-9-]+)$/i);
    if (candidateMatch) {
      meta = await fetchCandidateMeta(env, candidateMatch[1]);
    }
  }

  if (!meta) return response;

  const canonical = `${SITE_ORIGIN}${pathname}`;
  const html = await response.text();
  const rewritten = rewriteHtml(html, meta, canonical);

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(rewritten, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
