// Cloudflare Pages Function for /sitemap.xml.
//
// Without this, Cloudflare Pages serves the SPA's index.html for any unknown
// path, so /sitemap.xml returned HTTP 200 with content-type text/html and a
// body of <!doctype html>... — which GSC rejects with "Your Sitemap appears
// to be an HTML page." This function returns a real urlset XML document with
// the correct MIME type, regardless of whether a sitemap has been submitted
// to GSC yet.

interface Env {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

const SITE_ORIGIN = "https://txgovtracker.com";

const STATIC_PATHS: Array<{
  path: string;
  priority: string;
  changefreq: string;
}> = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/candidates", priority: "0.9", changefreq: "daily" },
  { path: "/polling", priority: "0.9", changefreq: "daily" },
  { path: "/top-donors", priority: "0.8", changefreq: "daily" },
  { path: "/independent-expenditures", priority: "0.8", changefreq: "daily" },
  { path: "/faq", priority: "0.5", changefreq: "weekly" },
];

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function fetchCandidateSlugs(env: Env): Promise<string[]> {
  const url = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL;
  const key = env.SUPABASE_ANON_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];

  try {
    const r = await fetch(
      `${url}/rest/v1/ca_candidates?select=slug&order=slug`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cf: { cacheTtl: 600, cacheEverything: true },
      } as RequestInit & {
        cf?: { cacheTtl?: number; cacheEverything?: boolean };
      },
    );
    if (!r.ok) return [];
    const rows = (await r.json()) as Array<{ slug: string | null }>;
    return rows
      .map((row) => row.slug)
      .filter((s): s is string => typeof s === "string" && s.length > 0);
  } catch {
    return [];
  }
}

export const onRequest = async (context: {
  env: Env;
}): Promise<Response> => {
  const today = new Date().toISOString().slice(0, 10);
  const slugs = await fetchCandidateSlugs(context.env);

  const urls: string[] = [];
  for (const { path, priority, changefreq } of STATIC_PATHS) {
    urls.push(
      `  <url>\n    <loc>${SITE_ORIGIN}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
    );
  }
  for (const slug of slugs) {
    urls.push(
      `  <url>\n    <loc>${SITE_ORIGIN}/candidates/${xmlEscape(slug)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    );
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
};
