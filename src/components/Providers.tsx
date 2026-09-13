"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SolanaWalletProvider } from "@/components/solana/SolanaWalletProvider";
import { useEffect, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7447/ingest/7261716d-045c-4378-bc38-b41af16803cc", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "f3f691" },
      body: JSON.stringify({
        sessionId: "f3f691",
        runId: "pre-fix",
        hypothesisId: "C",
        location: "Providers.tsx:boot",
        message: "providers mounted",
        data: { href: window.location.href, ua: navigator.userAgent.slice(0, 80) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    const onError = (event: ErrorEvent) => {
      // #region agent log
      fetch("http://127.0.0.1:7447/ingest/7261716d-045c-4378-bc38-b41af16803cc", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "f3f691" },
        body: JSON.stringify({
          sessionId: "f3f691",
          runId: "pre-fix",
          hypothesisId: "C",
          location: "Providers.tsx:onerror",
          message: "window onerror",
          data: { error: String(event.message), file: event.filename, line: event.lineno },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    };
    const onReject = (event: PromiseRejectionEvent) => {
      // #region agent log
      fetch("http://127.0.0.1:7447/ingest/7261716d-045c-4378-bc38-b41af16803cc", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "f3f691" },
        body: JSON.stringify({
          sessionId: "f3f691",
          runId: "pre-fix",
          hypothesisId: "C",
          location: "Providers.tsx:unhandledrejection",
          message: "unhandled rejection",
          data: { reason: String(event.reason) },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onReject);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onReject);
    };
  }, []);

  return (
    <TooltipProvider>
      <SolanaWalletProvider>{children}</SolanaWalletProvider>
    </TooltipProvider>
  );
}
