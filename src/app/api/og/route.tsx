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

  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #2d1b69 75%, #0f0f23 100%)",
            position: "relative",
          }}
        >
          {/* Background elements */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10%",
              right: "5%",
              width: "500px",
              height: "500px",
              background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 60%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "5%",
              left: "10%",
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "600px",
              background: "radial-gradient(circle, rgba(168, 85, 247, 0.03) 0%, transparent 80%)",
              borderRadius: "50%",
            }}
          />
          {/* Main content container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1e1e2e",
              borderRadius: "16px",
              padding: "48px",
              border: "1px solid #313244",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              maxWidth: "800px",
              margin: "0 40px",
              position: "relative",
            }}
          >
            {/* Logo/Icon */}
            <div
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#3b82f6",
                borderRadius: "12px",
                marginBottom: "24px",
                fontSize: "28px",
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
                fontSize: "48px",
                fontWeight: "700",
                color: "#ffffff",
                textAlign: "center",
                margin: "0 0 20px 0",
                lineHeight: "1.1",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "22px",
                color: "#a1a1aa",
                textAlign: "center",
                margin: "0 0 32px 0",
                lineHeight: "1.4",
                maxWidth: "700px",
                fontWeight: "400",
              }}
            >
              {description}
            </p>

            {/* Stats row */}
            {(language || lines || size) && (
              <div
                style={{
                  display: "flex",
                  gap: "16px",
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
                      backgroundColor: "#313244",
                      borderRadius: "8px",
                      padding: "8px 16px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#cdd6f4",
                        fontWeight: "500",
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
                      backgroundColor: "#313244",
                      borderRadius: "8px",
                      padding: "8px 16px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#cdd6f4",
                        fontWeight: "500",
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
                      backgroundColor: "#313244",
                      borderRadius: "8px",
                      padding: "8px 16px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#cdd6f4",
                        fontWeight: "500",
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
                color: "#6c7086",
                fontWeight: "400",
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
  } catch (error) {
    Logger.error("Failed to generate OG image", { error });
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
