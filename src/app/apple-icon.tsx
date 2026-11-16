import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** PNG version of the three-bar logo for iPhone home screens. */
export default function AppleIcon() {
  const bar = { width: 30, borderRadius: 5 };
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 14,
          paddingBottom: 40,
          background: "#0b1120",
        }}
      >
        <div style={{ ...bar, height: 54, background: "#eef3fb" }} />
        <div style={{ ...bar, height: 84, background: "#eef3fb" }} />
        <div style={{ ...bar, height: 116, background: "#2dd4bf" }} />
      </div>
    ),
    size,
  );
}
