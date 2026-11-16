import { ImageResponse } from "next/og";

export const alt = "CUI-Grades: internal marks, GPA and CGPA calculator for CUI students";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The preview card shown when a link is shared on WhatsApp, Facebook, X and so on. */
export default function OpengraphImage() {
  const bar = { width: 22, borderRadius: 4 };
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0b1120",
          color: "#e8edf5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 70 }}>
            <div style={{ ...bar, height: 32, background: "#e8edf5" }} />
            <div style={{ ...bar, height: 50, background: "#e8edf5" }} />
            <div style={{ ...bar, height: 70, background: "#2dd4bf" }} />
          </div>
          <div style={{ fontSize: 46, fontWeight: 700 }}>CUI-Grades</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, maxWidth: 960 }}>
            Internal marks, GPA and CGPA for CUI students
          </div>
          <div style={{ fontSize: 32, color: "#8d9ab0", marginTop: 28 }}>
            Pre-filled totals · Enter to move on · Voice commands · Official CUI scale
          </div>
        </div>
      </div>
    ),
    size,
  );
}
