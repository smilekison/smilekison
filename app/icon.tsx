import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 14,
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        SK
      </div>
    ),
    { ...size },
  );
}
