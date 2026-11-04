import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { wedding } from "@/data/wedding";
import { coupleNames, formatDate } from "@/lib/format";

export const alt = wedding.thangam.meta.title;
// Kept small: WhatsApp drops previews from heavy images.
export const size = { width: 800, height: 420 };
export const contentType = "image/png";

async function dataUrl(file: string, type: string) {
  const bytes = await fs.readFile(path.join(process.cwd(), "public/thangam", file));
  return `data:image/${type};base64,${bytes.toString("base64")}`;
}

// The picture WhatsApp shows beside the link.
export default async function Image() {
  const fontFile = (name: string) => fs.readFile(path.join(process.cwd(), "node_modules/@fontsource", name));
  const [topLeft, topRight, bottomLeft, bottomRight, photo, script, serif] = await Promise.all([
    dataUrl("corner-top-left.png", "png"),
    dataUrl("corner-top-right.png", "png"),
    dataUrl("corner-bottom-left.png", "png"),
    dataUrl("corner-bottom-right.png", "png"),
    dataUrl("preview-photo.jpg", "jpeg"),
    fontFile("alex-brush/files/alex-brush-latin-400-normal.woff"),
    fontFile("playfair-display/files/playfair-display-latin-500-normal.woff"),
  ]);

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#fdeee3", position: "relative", fontFamily: "Playfair" }}>
      {/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- rendered to a PNG, not a web page */}
      <img src={topLeft} width={120} style={{ position: "absolute", left: 0, top: 0 }} />
      <img src={topRight} width={120} style={{ position: "absolute", right: 0, top: 0 }} />
      <img src={bottomLeft} width={120} style={{ position: "absolute", left: 0, bottom: 0 }} />
      <img src={bottomRight} width={118} style={{ position: "absolute", right: 0, bottom: 0 }} />
      <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", padding: "0 110px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 330 }}>
          <div style={{ display: "flex", fontSize: 62, fontFamily: "Alex Brush", color: "#8d1231", whiteSpace: "nowrap" }}>
            {coupleNames("en")}
          </div>
          <div style={{ display: "flex", marginTop: 8, fontSize: 21, color: "#4a1a22" }}>
            {formatDate(wedding.muhurtham.start, "en")}
          </div>
          <div style={{ display: "flex", marginTop: 4, fontSize: 20, color: "#8d1231" }}>{wedding.venue.name.en}</div>
        </div>
        <img
          src={photo}
          width={230}
          height={190}
          style={{
            marginLeft: 16,
            objectFit: "cover",
            borderRadius: "115px 115px 12px 12px",
            border: "4px solid #d7a13e",
          }}
        />
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Alex Brush", data: script, weight: 400, style: "normal" },
        { name: "Playfair", data: serif, weight: 500, style: "normal" },
      ],
    },
  );
}
