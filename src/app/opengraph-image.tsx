import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "copr — Zambian fashion marketplace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: "linear-gradient(145deg, #0A1A3F 0%, #1E5EFF 55%, #7FB2FF 100%)",
          color: "#F5F8FF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.22), transparent 40%)",
          }}
        />
        <p style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2, margin: 0 }}>
          copr
        </p>
        <p
          style={{
            marginTop: 16,
            fontSize: 34,
            fontWeight: 500,
            maxWidth: 720,
            lineHeight: 1.3,
            opacity: 0.92,
          }}
        >
          Zambian fashion, from local brands to your door.
        </p>
        <p style={{ marginTop: 28, fontSize: 22, opacity: 0.75 }}>
          Shop in Kwacha · Delivered in Lusaka
        </p>
      </div>
    ),
    { ...size },
  );
}
