import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { project } from "@/lib/config";
import { theme } from "@/lib/theme";

export async function brandIcon(size: number) {
  const mascot = await readFile(join(process.cwd(), "public", project.assets.mascotFile));
  const src = `data:image/jpeg;base64,${mascot.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          borderRadius: 999,
          background: theme.bg,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          width={size}
          height={size}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 999,
          }}
        />
      </div>
    ),
    { width: size, height: size },
  );
}
