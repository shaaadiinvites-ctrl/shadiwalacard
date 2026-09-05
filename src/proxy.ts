import { NextRequest, NextResponse } from "next/server";

// The domain you bought on Vercel. Every wedding gets a subdomain of this,
// e.g. aditya-weds-ananya-2026.shadiwalacard.com
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shadiwalacard.com";

// Subdomains that should NOT be treated as a wedding slug
const RESERVED_SUBDOMAINS = new Set(["www", "app", "admin", "dashboard", "api"]);

export function proxy(req: NextRequest) {
  const hostHeader = req.headers.get("host") || "";
  const hostname = hostHeader.split(":")[0].toLowerCase(); // strip port for local dev

  const isApex = hostname === ROOT_DOMAIN;
  const firstLabel = hostname.split(".")[0];
  const isReservedOrApex =
    isApex || (RESERVED_SUBDOMAINS.has(firstLabel) && hostname.endsWith(ROOT_DOMAIN));
  const isWeddingSubdomain = hostname.endsWith(`.${ROOT_DOMAIN}`) && !isReservedOrApex;

  if (!isWeddingSubdomain) {
    // Root domain (shadiwalacard.com), www, localhost, *.vercel.app previews,
    // reserved subdomains, etc. — normal path-based routing, unchanged.
    return NextResponse.next();
  }

  const slug = hostname.slice(0, -(`.${ROOT_DOMAIN}`.length));
  const { pathname } = req.nextUrl;

  // Only the subdomain's root path resolves to the couple's invite page.
  // Everything else (assets, api routes) passes through untouched.
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = `/${slug}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals and API routes — no need to run middleware on those
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

