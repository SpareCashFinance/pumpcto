import { cn } from "@/lib/utils";

export function SlotHeadline({
  value,
  className,
}: {
  value: string;
  className?: string;
  entrance?: boolean;
}) {
  // #region agent log
  fetch("http://127.0.0.1:7447/ingest/7261716d-045c-4378-bc38-b41af16803cc", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "f3f691" },
    body: JSON.stringify({
      sessionId: "f3f691",
      runId: "post-fix",
      hypothesisId: "H",
      location: "SlotHeadline.tsx:static",
      message: "static headline",
      data: { chars: value.length },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  return <span className={cn("font-mono", className)}>{value}</span>;
}
