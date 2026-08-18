'use client';

import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';
import { useEffect } from 'react';

// Make sure to set these in your .env.local
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_nMSJa2WzpiPjv8N3GNZpeVzEabYLTPu4WPYzPtsA6at7';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

if (typeof window !== 'undefined') {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // We handle this manually if needed, or leave true to let PostHog do it automatically. 
                             // Next.js SPAs usually need manual capture on route changes, but PostHog autocapture handles most.
                             // Actually, for Next.js app router, PostHog recommends keeping capture_pageview: false and capturing it in a hook,
                             // but setting capture_pageleave: true
    capture_pageleave: true,
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <Provider client={posthog}>{children}</Provider>;
}
