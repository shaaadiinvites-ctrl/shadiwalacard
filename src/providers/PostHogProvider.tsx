'use client';

import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';

// Make sure to set these in your .env.local
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_nMSJa2WzpiPjv8N3GNZpeVzEabYLTPu4WPYzPtsA6at7';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

if (typeof window !== 'undefined') {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <Provider client={posthog}>{children}</Provider>;
}
