import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})
const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "MyLink - 나만의 멋진 멀티링크 프로필",
  description: "여러 개의 링크를 하나의 페이지로 모아보세요. 구글 계정으로 간편하게 시작하는 나만의 브랜딩 프로필.",
  keywords: ["멀티링크", "프로필", "링크트리", "인스타그램 링크", "MyLink", "포트폴리오"],
  openGraph: {
    title: "MyLink - 나만의 멋진 멀티링크 프로필",
    description: "여러 개의 링크를 하나의 페이지로 모아보세요. 구글 계정으로 간편하게 시작하는 나만의 브랜딩 프로필.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLink - 나만의 멋진 멀티링크 프로필",
    description: "여러 개의 링크를 하나의 페이지로 모아보세요. 구글 계정으로 간편하게 시작하는 나만의 브랜딩 프로필.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn("antialiased", inter.variable, "font-mono", jetbrainsMono.variable)}
    >
      <body>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
