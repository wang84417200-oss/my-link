import { ImageResponse } from "next/og";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData } from "@/types";

export const runtime = "nodejs"; // Firebase Firestore SDK 호환성을 위해 Node.js 런타임 사용
export const alt = "MyLink Profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ displayName: string }> | { displayName: string } }) {
  // Next.js 15+ 에서는 params가 Promise이므로 await 처리해야 함
  const resolvedParams = await params;
  const { displayName } = resolvedParams;

  let userData: UserData | null = null;
  let fontData: ArrayBuffer | null = null;

  try {
    // 1. 폰트 로드
    const fontRes = await fetch(
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/packages/pretendard/dist/public/static/Pretendard-Bold.otf"
    );
    if (fontRes.ok) {
      fontData = await fontRes.arrayBuffer();
    }

    // 2. 파이어베이스 데이터 로드
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", displayName));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      userData = snapshot.docs[0].data() as UserData;
    }
  } catch (error) {
    console.error("OG Image generation error:", error);
  }

  // 사용자 정보가 없을 때의 Fallback
  const username = userData?.username || "MyLink User";
  const bio = userData?.bio || "나만의 멋진 멀티링크 프로필을 만나보세요.";
  const photoURL = userData?.photoURL;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000", // background matching static OG
          color: "#ffffff",
          fontFamily: fontData ? '"Pretendard"' : "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Profile Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "700px",
            padding: "60px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "linear-gradient(to top right, #d946ef, #8b5cf6)", // match static OG gradient
              boxShadow: "0 25px 50px rgba(217, 70, 239, 0.2)",
              padding: "6px", // simulate ring
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: "#09090b",
                overflow: "hidden",
              }}
            >
              {photoURL ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={photoURL}
                  alt={username}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "80px" }}>🧑‍💻</span>
              )}
            </div>
          </div>

          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              margin: 0,
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            {username}
          </h1>

          <p
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#a1a1aa",
              margin: 0,
              marginTop: "8px",
              textAlign: "center",
            }}
          >
            @{displayName}
          </p>

          <p
            style={{
              fontSize: "28px",
              color: "#d4d4d8",
              marginTop: "32px",
              textAlign: "center",
              lineHeight: 1.4,
              maxWidth: "550px",
            }}
          >
            {bio}
          </p>
        </div>

        {/* Footer branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            opacity: 0.5,
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "0.1em" }}>
            MyLink.me
          </span>
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
