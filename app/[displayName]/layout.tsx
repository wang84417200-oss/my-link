import { Metadata } from "next";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ displayName: string }> | { displayName: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const { displayName } = resolvedParams;

  let userData: UserData | null = null;
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", displayName));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      userData = snapshot.docs[0].data() as UserData;
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  const title = userData ? `${userData.username} (@${displayName}) - MyLink` : `@${displayName} - MyLink Profile`;
  const description = userData?.bio || "나만의 멋진 멀티링크 프로필을 만나보세요.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
