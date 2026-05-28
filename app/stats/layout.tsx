import { Metadata } from "next";

export const metadata: Metadata = {
  title: "방문 통계 - MyLink",
  description: "내 프로필과 링크들의 실시간 방문 통계를 확인해보세요.",
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
