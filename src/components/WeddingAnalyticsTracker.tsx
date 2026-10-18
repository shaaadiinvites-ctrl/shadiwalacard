'use client';

import { useEffect, useRef } from 'react';

interface Props {
  slug: string;
}

export default function WeddingAnalyticsTracker({ slug }: Props) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!slug || trackedRef.current) return;
    trackedRef.current = true;

    // 1. Record Page View
    try {
      fetch('/api/wedding-analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, event: 'view' }),
        keepalive: true,
      }).catch(() => {});
    } catch {}

    // 2. Track 1-Tap Google Maps Clicks
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      if (href.includes('maps.google') || href.includes('google.com/maps')) {
        try {
          fetch('/api/wedding-analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, event: 'map_click' }),
            keepalive: true,
          }).catch(() => {});
        } catch {}
      }
    };

    document.addEventListener('click', handleDocumentClick, { passive: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [slug]);

  return null;
}
