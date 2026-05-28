"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useLinks } from "@/hooks/use-links";
import { useUserData } from "@/hooks/use-user-data";
import { 
  RiLoader4Line, 
  RiArrowLeftLine, 
  RiBarChartFill, 
  RiEyeLine,
  RiLinksLine
} from "@remixicon/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const { userData, isLoading: isUserLoading } = useUserData(user);
  const { links, isLoading: isLinksLoading } = useLinks(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (isAuthLoading || isUserLoading || isLinksLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <RiLoader4Line className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const totalClicks = links.reduce((sum, link) => sum + (link.clicks ?? 0), 0);

  const chartData = [...links]
    .reverse()
    .map((link) => ({
      name: link.title.length > 8 ? `${link.title.slice(0, 8)}...` : link.title,
      fullName: link.title,
      clicks: link.clicks ?? 0,
    }));

  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="relative min-h-svh bg-background selection:bg-primary/30 overflow-x-hidden">
      {/* Decorative Blur Background Blobs */}
      <div className="fixed -top-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-[10%] -left-[10%] h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-col px-6 pt-12 pb-20">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8 animate-reveal">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="h-10 w-10 rounded-full text-muted-foreground/80 hover:bg-muted"
          >
            <RiArrowLeftLine className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-black tracking-tight text-foreground/90">
            실시간 방문 통계
          </h1>
          <div className="w-10 h-10 pointer-events-none" />
        </div>

        {/* Stats Overview Section */}
        <div className="grid grid-cols-1 gap-4 animate-reveal" style={{ animationDelay: "100ms" }}>
          
          {/* Total Clicks Gradient Card */}
          <Card className="glass overflow-hidden border-primary/20 shadow-xl shadow-primary/5 bg-linear-to-tr from-primary/10 to-violet-500/5">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  누적 총 클릭수
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter text-foreground">
                    {totalClicks.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">회</span>
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-primary to-violet-500 shadow-lg shadow-primary/20 text-white">
                <RiBarChartFill size={28} />
              </div>
            </CardContent>
          </Card>

          {/* Mini Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="glass border-border/5">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">등록된 링크 수</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-black tracking-tight">{links.length}</span>
                  <span className="text-xs font-bold text-muted-foreground">개</span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-border/5">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">평균 클릭 수</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-black tracking-tight">
                    {links.length > 0 ? Math.round(totalClicks / links.length).toLocaleString() : 0}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">회</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Visual Chart Card */}
        <div className="mt-6 animate-reveal" style={{ animationDelay: "200ms" }}>
          <Card className="glass border-border/5 overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-base font-black tracking-tight">링크별 클릭 분석</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground/70">
                각 링크의 누적 성과를 막대 그래프로 비교합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              {links.length > 0 ? (
                <div className="w-full h-[240px] flex items-center justify-center">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <BarChart 
                      data={chartData} 
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.15)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground) / 0.5)" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false}
                        dy={8}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground) / 0.5)" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false}
                        allowDecimals={false}
                        dx={-8}
                      />
                      <ChartTooltip 
                        cursor={{ fill: "hsl(var(--muted) / 0.2)", radius: 8 }}
                        content={<ChartTooltipContent hideLabel />} 
                      />
                      <Bar 
                        dataKey="clicks" 
                        radius={[8, 8, 0, 0]}
                        maxBarSize={32}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.6)"}
                            className="transition-opacity duration-300 hover:opacity-85"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40 gap-2">
                  <RiLinksLine size={32} className="opacity-20 animate-pulse" />
                  <p className="text-sm font-bold">아직 분석할 링크가 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Link List Summary */}
        <div className="mt-6 animate-reveal flex flex-col gap-3" style={{ animationDelay: "300ms" }}>
          <h2 className="text-sm font-black tracking-tight text-foreground/75 px-1">링크별 상세 통계</h2>
          
          {links.length > 0 ? (
            links.map((link) => (
              <div 
                key={link.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background shadow-inner">
                    {link.icon ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={link.icon} alt="icon" className="h-5 w-5" />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-muted" />
                    )}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-bold tracking-tight text-foreground/90 truncate">{link.title}</span>
                    <span className="text-[10px] font-medium text-muted-foreground/60 truncate">{link.url}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 shrink-0 bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10">
                  <RiEyeLine size={13} className="text-primary/70" />
                  <span className="text-xs font-black tracking-tight">{(link.clicks ?? 0).toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-muted-foreground/40 font-bold">
              상세 통계 정보가 없습니다.
            </div>
          )}
        </div>

        {/* Footer Branding */}
        <footer className="mt-16 flex flex-col items-center gap-4 opacity-30 animate-reveal" style={{ animationDelay: "400ms" }}>
          <span className="text-[10px] font-black uppercase tracking-widest">MyLink Analytics</span>
        </footer>

      </main>
    </div>
  );
}
