"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CheckoutRedirect() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const qs = params.toString();
    router.replace(qs ? `/cart?${qs}` : "/cart");
  }, [params, router]);

  return null;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutRedirect />
    </Suspense>
  );
}
