"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { setApiKey } from "@/lib/api-key";

export default function ApiKeyCapture() {
  const params = useSearchParams();

  useEffect(() => {
    const key = params.get("api_key");
    if (key) {
      setApiKey(key);
      const url = new URL(window.location.href);
      url.searchParams.delete("api_key");
      window.history.replaceState({}, "", url.toString());
    }
  }, [params]);

  return null;
}
