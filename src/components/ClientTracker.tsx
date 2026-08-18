'use client';

import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

export default function ClientTracker({ eventName, properties }: { eventName: string, properties?: any }) {
  const posthog = usePostHog();
  
  useEffect(() => {
    if (posthog) {
      posthog.capture(eventName, properties);
    }
  }, [posthog, eventName, JSON.stringify(properties)]);
  
  return null;
}
