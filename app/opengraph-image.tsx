import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MyLink - 나만의 링크 프로필";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  let fontData: ArrayBuffer | null = null;
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/packages/pretendard/dist/public/static/Pretendard-Bold.otf"
    );
    if (res.ok) {
      fontData = await res.arrayBuffer();
    }
  } catch (e) {
    console.error("Font fetch error:", e);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000", // Dark background to match hero
          color: "#ffffff",
          fontFamily: fontData ? '"Pretendard"' : "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
            zIndex: 10,
          }}
        >
          {/* Hero Icon (rounded-2xl bg-linear-to-tr from-primary to-violet-500) */}
          <div
            style={{
              display: "flex",
              width: "140px",
              height: "140px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "40px", // slightly more rounded for bigger size
              background: "linear-gradient(to top right, #d946ef, #8b5cf6)", // warm pink to violet to match primary/violet vibe in dark mode
              boxShadow: "0 25px 50px rgba(217, 70, 239, 0.2)",
              marginBottom: "16px",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="70" height="70" fill="#ffffff">
              <path d="M18.364 15.5355L16.9497 14.1213L18.364 12.7071C20.3166 10.7545 20.3166 7.58868 18.364 5.63604C16.4114 3.68342 13.2455 3.68342 11.2929 5.63604L9.87868 7.05025L8.46447 5.63604L9.87868 4.22183C12.6124 1.48815 17.0445 1.48815 19.7782 4.22183C22.5118 6.9555 22.5118 11.3876 19.7782 14.1213L18.364 15.5355ZM15.5355 18.364L14.1213 19.7782C11.3876 22.5118 6.9555 22.5118 4.22183 19.7782C1.48815 17.0445 1.48815 12.6124 4.22183 9.87868L5.63604 8.46447L7.05025 9.87868L5.63604 11.2929C3.68342 13.2455 3.68342 16.4114 5.63604 18.364C7.58868 20.3166 10.7545 20.3166 12.7071 18.364L14.1213 16.9497L15.5355 18.364ZM14.8284 7.75736L16.2426 9.17157L9.17157 16.2426L7.75736 14.8284L14.8284 7.75736Z"></path>
            </svg>
          </div>

          <h1
            style={{
              fontSize: "76px",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              margin: 0,
              color: "#ffffff", // text-foreground in dark mode
            }}
          >
            MyLink
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <p
              style={{
                fontSize: "36px",
                color: "#a1a1aa", // text-muted-foreground
                margin: 0,
                letterSpacing: "-0.02em",
                textAlign: "center",
              }}
            >
              나만의 멋진 멀티링크 프로필을 만들어보세요.
            </p>
            <p
              style={{
                fontSize: "36px",
                color: "#a1a1aa",
                margin: 0,
                letterSpacing: "-0.02em",
                textAlign: "center",
              }}
            >
              구글 계정으로 간편하게 시작할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Pretendard",
              data: fontData,
              weight: 700,
              style: "normal",
            },
          ]
        : undefined,
    }
  );
}
