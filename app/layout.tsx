import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'})

export const metadata: Metadata = {
  title: "MyLink - 나만의 링크 프로필",
  description: "여러 개의 링크를 하나의 페이지로 정리하고 나만의 브랜딩을 시작해보세요.",
}


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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
