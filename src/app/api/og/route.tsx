import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import Logger from "@/common/logger";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Paste";
  const description =
    searchParams.get("description") || "Free and open-source paste service";
  const language = searchParams.get("language") || "";
  const lines = searchParams.get("lines") || "";
  const size = searchParams.get("size") || "";
  
  // Extract paste ID from title (format: "Paste {id}.{ext}")
  const pasteId = title.replace(/^Paste\s+/, '').replace(/\.[^.]+$/, '');

  try {
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            backgroundImage: "radial-gradient(circle at 25% 25%, #1a1a1a 2px, transparent 2px)",
            backgroundSize: "40px 40px",
          }}
        >
          {/* Main content container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              borderRadius: "16px",
              padding: "48px",
              border: "1px solid #333",
              maxWidth: "1000px",
              margin: "0 40px",
            }}
          >
            {/* Logo/Icon */}
            <div
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#3b82f6",
                borderRadius: "16px",
                marginBottom: "24px",
                fontSize: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              📋
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "42px",
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                margin: "0 0 16px 0",
                lineHeight: "1.1",
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "20px",
                color: "#a1a1aa",
                textAlign: "center",
                margin: "0 0 24px 0",
                lineHeight: "1.3",
                maxWidth: "800px",
              }}
            >
              {description}
            </p>

            {/* Stats row */}
            {(language || lines || size) && (
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {language && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid #3b82f6",
                      borderRadius: "8px",
                      padding: "8px 16px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#3b82f6",
                        fontWeight: "600",
                      }}
                    >
                      {language}
                    </span>
                  </div>
                )}
                {lines && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "rgba(34, 197, 94, 0.1)",
                      border: "1px solid #22c55e",
                      borderRadius: "8px",
                      padding: "8px 16px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#22c55e",
                        fontWeight: "600",
                      }}
                    >
                      {lines} lines
                    </span>
                  </div>
                )}
                {size && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "rgba(168, 85, 247, 0.1)",
                      border: "1px solid #a855f7",
                      borderRadius: "8px",
                      padding: "8px 16px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#a855f7",
                        fontWeight: "600",
                      }}
                    >
                      {size}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                marginTop: "32px",
                fontSize: "16px",
                color: "#71717a",
              }}
            >
              paste.fascinated.cc
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );

    // Add caching and compression headers
    imageResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    imageResponse.headers.set('ETag', `"${pasteId}"`);
    imageResponse.headers.set('Content-Encoding', 'gzip');
    imageResponse.headers.set('Vary', 'Accept-Encoding');
    
    return imageResponse;
  } catch (error) {
    Logger.error("Failed to generate OG image", { error });
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
