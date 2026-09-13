import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const mascot = await readFile(join(process.cwd(), "public/mascot.jpg"));
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
          background: "linear-gradient(135deg, #050806 0%, #121c16 55%, #052e16 100%)",
          color: "#f7f4ee",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 640 }}>
          <div style={{ fontSize: 20, letterSpacing: 6, color: "#86efac" }}>
            $PUMP · CTO · SOLANA · PUMP.FUN
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 0.95, marginTop: 18 }}>
            COMMUNITY TAKEOVER
          </div>
          <div style={{ fontSize: 34, color: "#86efac", marginTop: 16 }}>
            3% tax. Paid back to holders in PUMP.
          </div>
          <div style={{ fontSize: 22, color: "#d8f5e4", marginTop: 28 }}>
            Dev left. Community stayed. Buy on Jupiter.
          </div>
        </div>
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: 999,
            overflow: "hidden",
            border: "3px solid rgba(134,239,172,0.4)",
            background: "#050806",
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
