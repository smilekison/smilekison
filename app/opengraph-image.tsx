import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0e1a",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(102,126,234,0.35), transparent 55%), radial-gradient(circle at 85% 85%, rgba(118,75,162,0.3), transparent 55%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 88,
            height: 88,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontSize: 36,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 40,
          }}
        >
          SK
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: "#f6f7fc",
            letterSpacing: "-0.03em",
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#a8aec7",
            marginTop: 18,
          }}
        >
          {profile.role} · {profile.statement}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#7c8cf0",
            marginTop: 48,
            letterSpacing: "0.04em",
          }}
        >
          {profile.domain.toUpperCase()}
        </div>
      </div>
    ),
    { ...size },
  );
}
