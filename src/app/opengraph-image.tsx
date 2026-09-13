import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { project } from "@/lib/config";
import { theme } from "@/lib/theme";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const mascot = await readFile(join(process.cwd(), "public", project.assets.mascotFile));
  const src = `data:image/jpeg;base64,${mascot.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "64px",
          background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.bg3} 55%, ${theme.inkOnAccent} 100%)`,
          color: theme.ink,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 640 }}>
          <div style={{ fontSize: 20, letterSpacing: 6, color: theme.accent }}>
            {project.ticker} · CTO · SOLANA · PUMP.FUN
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 0.95, marginTop: 18 }}>
            COMMUNITY TAKEOVER
          </div>
          <div style={{ fontSize: 34, color: theme.accent, marginTop: 16 }}>
            {project.coreLine}
          </div>
          <div style={{ fontSize: 22, color: theme.cream, marginTop: 28 }}>
            {project.quote}
          </div>
        </div>
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: 999,
            overflow: "hidden",
            border: `3px solid ${theme.line}`,
            background: theme.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={360} height={360} alt="" style={{ objectFit: "cover" }} />
        </div>
      </div>
    ),
    size,
  );
}
