"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useLinks } from "@/hooks/use-links";
import { useUserData } from "@/hooks/use-user-data";
import { 
  RiLoader4Line, 
  RiBarChartFill, 
  RiEyeLine,
  RiLinksLine,
  RiArrowRightSLine,
  RiLogoutBoxLine,
  RiExternalLinkLine
} from "@remixicon/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster, toast } from "sonner";

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("로그아웃 되었습니다.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isAuthLoading || isUserLoading || isLinksLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <RiLoader4Line className="h-8 w-8 animate-spin text-amber-500" />
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
      color: "#eab308", // Tailwind yellow-500 HSL
    },
  };

  return (
    <div className="relative min-h-svh bg-background selection:bg-amber-500/30 overflow-x-hidden">
      <Toaster position="top-center" richColors />

      {/* Decorative Yellow/Amber Neon Background Blobs */}
      <div className="fixed -top-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-[10%] -left-[10%] h-[400px] w-[400px] rounded-full bg-yellow-500/5 blur-[100px] pointer-events-none" />

      {/* Shared Dashboard Header with Profile Dropdown */}
      <header className="fixed top-0 left-0 z-40 flex w-full items-center justify-center bg-background/80 backdrop-blur-md border-b border-border/10">
        <div className="flex w-full max-w-md md:max-w-2xl lg:max-w-3xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "/"}>
            <span className="text-2xl font-black tracking-tighter text-amber-500">MyLink</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`/${userData?.displayName}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold bg-amber-500 text-black hover:opacity-90 shadow-sm shadow-amber-500/20 transition-all group active:scale-95"
            >
              <RiExternalLinkLine className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">내 페이지</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full ring-offset-2 ring-offset-background transition-all hover:scale-105 active:scale-95">
                <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-amber-500/20 bg-muted">
                  {userData?.photoURL ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={userData.photoURL} alt="프로필" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-amber-500/10 text-amber-500">
                      <span className="text-xs font-bold">{userData?.username?.[0] || "U"}</span>
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 font-medium mt-2 border-border/40 bg-background/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-200"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal px-4 py-4 mb-1">
                    <div className="flex flex-col space-y-1.5">
                      <p className="text-sm font-black leading-none text-foreground tracking-tight">{userData?.username}</p>
                      <p className="text-[12px] leading-none text-muted-foreground font-medium">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-border/40 mx-2" />
                <DropdownMenuGroup className="p-1">
                  <DropdownMenuItem 
                    className="cursor-pointer gap-3 py-3 px-3 rounded-xl transition-all focus:bg-amber-500/10 focus:text-amber-600 group"
                    onClick={() => {
                      window.open(`/${userData?.displayName}`, '_blank');
                    }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/5 group-focus:bg-amber-500/20 transition-colors">
                      <RiArrowRightSLine className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[13px]">내 페이지 보기</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer gap-3 py-3 px-3 rounded-xl transition-all focus:bg-amber-500/10 focus:text-amber-600 group"
                    onClick={() => {
                      window.location.href = "/stats";
                    }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/5 group-focus:bg-amber-500/20 transition-colors">
                      <RiBarChartFill className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[13px]">통계 보기</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer gap-3 py-3 px-3 rounded-xl transition-all focus:bg-amber-500/10 focus:text-amber-600 group"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/${userData?.displayName}`);
                      toast.success("링크가 복사 되었습니다");
                    }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/5 group-focus:bg-amber-500/20 transition-colors">
                      <RiLinksLine className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[13px]">내 프로필 링크 복사하기</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-border/40 mx-2" />
                <div className="p-1">
                  <DropdownMenuItem 
                    className="cursor-pointer gap-3 py-3 px-3 rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive transition-all group"
                    onClick={handleLogout}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/5 group-focus:bg-destructive/10 transition-colors">
                      <RiLogoutBoxLine className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[13px]">로그아웃</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Stats Content */}
      <main className="relative z-10 mx-auto flex w-full max-w-md md:max-w-2xl lg:max-w-3xl flex-col px-6 pt-24 pb-20">
        
        {/* Header Title section */}
        <div className="flex items-center justify-between mb-6 animate-reveal">
          <h1 className="text-xl font-black tracking-tight text-foreground/90 flex items-center gap-2">
            <RiBarChartFill className="h-5 w-5 text-amber-500" />
            실시간 방문 통계
          </h1>
        </div>

        {/* Stats Overview Card Section - Yellow/Amber Neon theme */}
        <div className="grid grid-cols-1 gap-4 animate-reveal" style={{ animationDelay: "100ms" }}>
          
          {/* Total Clicks Premium Gold Card */}
          <Card className="glass overflow-hidden border-amber-500/20 shadow-2xl shadow-amber-500/5 bg-linear-to-tr from-amber-500/10 to-yellow-500/5">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <span className="text-[12px] font-bold text-amber-500/80 uppercase tracking-widest leading-none">
                  누적 총 클릭수
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter text-foreground">
                    {totalClicks.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">회</span>
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/20 text-black">
                <RiBarChartFill size={28} />
              </div>
            </CardContent>
          </Card>

          {/* Mini Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="glass border-border/5">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">등록된 링크 수</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-black tracking-tight text-foreground/90">{links.length}</span>
                  <span className="text-xs font-bold text-muted-foreground">개</span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-border/5">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">평균 클릭 수</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-black tracking-tight text-foreground/90">
                    {links.length > 0 ? Math.round(totalClicks / links.length).toLocaleString() : 0}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">회</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recharts Analytics Card with Amber Glow */}
        <div className="mt-6 animate-reveal" style={{ animationDelay: "200ms" }}>
          <Card className="glass border-border/5 overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-base font-black tracking-tight">링크별 클릭 분석</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground/70">
                각 링크의 누적 성과를 골드빛 막대 그래프로 비교합니다.
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
                        cursor={{ fill: "rgba(156, 163, 175, 0.15)", radius: 8 }}
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
                            fill={index % 2 === 0 ? "#f59e0b" : "#fbbf24"} // Amber 500 & Amber 400 교차
                            className="transition-opacity duration-300 hover:opacity-80"
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

        {/* Link List Summary Table */}
        <div className="mt-6 animate-reveal flex flex-col gap-3" style={{ animationDelay: "300ms" }}>
          <h2 className="text-sm font-black tracking-tight text-foreground/75 px-1">링크별 상세 통계</h2>
          
          {links.length > 0 ? (
            links.map((link) => (
              <div 
                key={link.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm transition-all hover:border-amber-500/20"
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
                
                <div className="flex items-center gap-1.5 shrink-0 bg-amber-500/5 px-3 py-1.5 rounded-xl border border-amber-500/10 text-amber-500">
                  <RiEyeLine size={13} className="text-amber-500/80" />
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
