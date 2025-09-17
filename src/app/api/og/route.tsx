import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Paste";
    const description =
      searchParams.get("description") || "Free and open-source paste service";
    const language = searchParams.get("language") || "";
    const lines = searchParams.get("lines") || "";
    const size = searchParams.get("size") || "";

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
            backgroundColor: "#0a0a0a",
            backgroundImage:
              "linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
        >
          {/* Main content container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              borderRadius: "20px",
              padding: "60px",
              border: "2px solid #333",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
              maxWidth: "1000px",
              margin: "0 40px",
            }}
          >
            {/* Logo/Icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                backgroundColor: "#3b82f6",
                borderRadius: "20px",
                marginBottom: "30px",
                fontSize: "40px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              📋
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                margin: "0 0 20px 0",
                lineHeight: "1.2",
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "24px",
                color: "#a1a1aa",
                textAlign: "center",
                margin: "0 0 30px 0",
                lineHeight: "1.4",
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
                  gap: "30px",
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
                      borderRadius: "12px",
                      padding: "12px 20px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
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
                      borderRadius: "12px",
                      padding: "12px 20px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
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
                      borderRadius: "12px",
                      padding: "12px 20px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
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
                display: "flex",
                alignItems: "center",
                marginTop: "40px",
                fontSize: "18px",
                color: "#71717a",
              }}
            >
              <span>paste.fascinated.cc</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
