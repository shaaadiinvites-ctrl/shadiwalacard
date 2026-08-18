# Security Audit — Shadiwalacard (shadiwalacard.com)

Reviewed: all API routes, middleware, Supabase schema/RLS/storage policies, env var handling, and the payment flow. Findings below, ordered by how much damage they could do. Nothing has been changed yet — this is the report you asked for. Say which ones to fix and I'll do them (or say "fix everything" and I'll go top to bottom).

---

## CRITICAL — fix before you send this link to a single real customer

### 1. The secret "edit link" token is leaked on every public invite page
`src/app/[slug]/page.tsx` fetches the wedding row with `select("*")` — that pulls **every** column, including `edit_token`, `contact_number`, `primary_email`, `razorpay_order_id`, and `razorpay_payment_id` — and hands the whole object as a prop to `WeddingInvitePage` / `ModernMinimalTemplate` / `FloralRomanceTemplate`, which are all `"use client"` components.

When a server component passes data into a client component, Next.js embeds that data as plain text in the page's HTML (in a `self.__next_f.push(...)` script tag) so the browser can hydrate it. That means **anyone who right-clicks "View Page Source" on a live wedding invite can read the edit_token in plain text** — no hacking skill needed, just Ctrl+U.

Once someone has that token, they can hit `/edit/<token>` or `POST /api/update-wedding` and rewrite that couple's entire invite — change names, delete photos, post anything. This defeats the entire point of the secret-link design.

**Fix:** stop selecting `*` for the public page. Select only the columns the template actually displays, and never include `edit_token`, `razorpay_order_id`, `razorpay_payment_id`, `contact_number`, `primary_email` (unless a template intentionally displays contact info) in what gets passed to a client component. `/edit/[token]/page.tsx` is a server component that never re-exposes the token to the browser, so it's fine as-is.

### 2. A Razorpay key file is sitting in the project root
`razorpay_test_api_keys_1783082815511.csv` (the file Razorpay auto-downloads when you generate keys) is in `D:\Downloads\weddinginvites\abc\`, not in `.gitignore` or `.vercelignore`. Every `vercel --prod` deploy uploads it as part of your source bundle. It's currently test-mode keys (lower stakes), but the same mistake with live keys would hand out real payment-gateway credentials.

**Fix:** delete the CSV from the project folder entirely (keys should only live in Vercel's env vars + your local `.env.local`, which *is* gitignored). Also delete `.env.vercel.check` in the root — it's a leftover debug dump from an earlier session and may contain plaintext env values.

### 3. Race condition lets one payment create two (or more) wedding sites
In `src/app/api/submit-wedding/route.ts`, the flow is: check `payment_orders.status === 'verified'` → do a bunch of work (slug generation, image uploads, insert wedding row) → *then* mark the payment order `used`. If someone fires two submit requests back-to-back with the same `paymentOrderId` (double-click, browser retry, or deliberately scripted), both requests can pass the "is it verified" check before either one flips the status to `used` — resulting in two paid wedding sites from one ₹999–1499 payment.

Your `verify-payment` route already does this correctly (atomic conditional update: `.eq("status", "created")` in the same UPDATE that sets `verified`). `submit-wedding` needs the same pattern.

**Fix:** before doing any of the expensive work, atomically flip `payment_orders` from `verified` → `used` (`update ... where id = X and status = 'verified'`) and only proceed if that update actually affected a row. If it affected 0 rows, someone already used this payment — reject.

---

## HIGH — fix soon

### 4. No rate limiting anywhere
None of the API routes (`create-order`, `verify-payment`, `submit-wedding`, `update-wedding`) limit how often a single IP/browser can call them. Someone could script thousands of calls to `/api/razorpay/create-order` (cheap for them, clutters your `payment_orders` table and can trip Razorpay's own API rate limits on your account) or hammer `/api/submit-wedding` / `/api/update-wedding`. This is the most realistic path to "someone brings the site down" — not sophisticated hacking, just a simple script looping a POST request.

**Fix:** add basic per-IP rate limiting (Vercel has this built into its Firewall — free tier included — or a lightweight in-code limiter keyed on IP + route). I'd recommend Vercel's Firewall rules since they block at the edge, before your function even runs.

### 5. Confirm the old "anyone can insert" policy is actually gone
`supabase-schema.sql` originally created `"Public can insert" on weddings for insert with check (true)` — meaning any browser with just the anon key could insert a wedding row directly, no payment needed. `supabase-add-payments.sql` (which you already ran) drops this policy. Given the grants issue we just hit on `payment_orders`, it's worth a 30-second check: in Supabase → Authentication → Policies → `weddings` table, confirm "Public can insert" is no longer listed.

### 6. No security headers
There's no Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, or Strict-Transport-Security header set anywhere (`next.config.ts` is empty). Without X-Frame-Options/frame-ancestors, someone could iframe your checkout page on another site and try to trick users into clicking "Pay" (clickjacking). Without CSP, if any injection point is ever found, its impact is worse than it needs to be.

**Fix:** add a `headers()` block in `next.config.ts` with at minimum `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a baseline CSP.

### 7. Uploaded image type is trusted from the browser, not verified
`submit-wedding` / `update-wedding` check `file.type.startsWith("image/")`, but `file.type` is whatever the browser/client claims — trivially spoofable. Someone could upload an HTML file or an SVG containing a `<script>` tag labeled as `image/svg+xml`; if that file is ever opened directly (not just displayed as an `<img>`), it can run script in your storage domain's context.

**Fix:** explicitly reject `image/svg+xml`, and ideally verify the first few bytes of the file (magic numbers) match a real JPEG/PNG/WebP rather than trusting the declared MIME type.

---

## MEDIUM

### 8. No length limits on text fields
`ourStory`, `brideFamilyDetails`, `specialInstructions`, etc. accept any length of text with no server-side cap. Someone could submit megabytes of text per field repeatedly, bloating your database and page sizes. Add reasonable max-length checks in the API routes (defense in depth — even if the form UI already limits this, the API doesn't).

### 9. No bot protection on checkout / forms
Nothing stops a script (not a real browser) from calling your APIs directly, skipping the UI entirely. Combined with #4, this is what actually enables abuse. A CAPTCHA (e.g., Cloudflare Turnstile, free) on the checkout page is a cheap, effective add.

### 10. No visibility into abuse when it happens
There's no logging/alerting for spikes in failed payments, repeated submissions from one IP, or unusual traffic. You'd only find out something was wrong from a support email or a Razorpay dashboard anomaly. Vercel's built-in Analytics/Logs plus a simple alert (e.g., on 5xx spike) would close this gap cheaply.

---

## LOW / GOOD TO KNOW

### 11. "Someone could steal our templates" — set realistic expectations
Any website's HTML/CSS/JS is downloadable by design — that's how browsers work. A determined person can always view-source, save assets, or screenshot a design. What you *can* do: keep template logic server-rendered where possible (less to copy from the client bundle), avoid shipping unused/experimental template code to production (the stray `Indian Wedding Invitation Landing Page/` folder is correctly excluded from deploys via `.vercelignore` — good), and rely on business/legal deterrents (watermarks, ToS, trademark) rather than technical ones for a fully public-facing product. 100% prevention isn't realistic for any web app; "harder to casually copy" is.

### 12. Dependency hygiene
Run `npm audit` periodically (and after adding new packages) to catch known vulnerabilities in dependencies.

### 13. DDoS at the infrastructure level
Actual volumetric DDoS (thousands of requests/sec trying to knock the site offline) is largely absorbed by Vercel's edge network already — you don't need to build this yourself. The realistic risk for a site your size is application-level abuse (see #4), not infrastructure DDoS.

---

## Suggested order of fixes

1. Delete the Razorpay CSV + `.env.vercel.check` from the project (30 seconds, zero risk).
2. Fix the `edit_token`/PII leak on the public invite page (critical, contained code change).
3. Fix the payment race condition in `submit-wedding` (critical, contained code change).
4. Confirm the `weddings` insert policy is dropped in Supabase (30-second check).
5. Add security headers (contained config change).
6. Add rate limiting (moderate effort, biggest anti-abuse payoff).
7. Tighten image upload validation.
8. Add field length limits + a CAPTCHA on checkout.

Tell me which numbers to do and I'll implement them.
