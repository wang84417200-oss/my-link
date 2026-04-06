"use client";

import { useState } from "react";
import { dummyLinks } from "@/data/link";
import { Card, CardContent } from "@/components/ui/card";
import { RiArrowRightSLine, RiShareLine, RiMore2Fill } from "@remixicon/react";
import { AddLinkDialog } from "@/components/add-link-dialog";
import { getFaviconUrl } from "@/lib/utils";

export default function Page() {
  const [links, setLinks] = useState(dummyLinks);

  const handleAddLink = (title: string, url: string) => {
    const newLink = {
      id: Date.now().toString(),
      title,
      url,
      icon: getFaviconUrl(url),
      clicks: 0,
    };
    setLinks([newLink, ...links]);
  };

  return (
    <div className="relative min-h-svh overflow-hidden selection:bg-primary/30">
      {/* Main Content Area */}
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-6 pt-16 pb-20">
        
        {/* Top Actions (Share/More) */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-foreground/80 backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-95">
            <RiShareLine size={20} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-foreground/80 backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-95">
            <RiMore2Fill size={20} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex animate-reveal flex-col items-center text-center">
          {/* Avatar with Premium Border */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-linear-to-tr from-primary to-violet-500 opacity-75 blur-sm transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-card ring-4 ring-background/50 text-5xl">
              <span role="img" aria-label="프로필">🧑‍💻</span>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col gap-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground">@MyLinkProfile</h1>
            <p className="text-sm font-medium text-muted-foreground">김철수 (Chul-soo Kim)</p>
          </div>
          
          <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-muted-foreground/80">
            디지털 노마드 & 컨텐츠 크리에이터 ✨<br/>
            세상의 모든 유용한 정보를 연결합니다.
          </p>
        </div>

        {/* Action Section */}
        <div className="mt-10 w-full animate-reveal" style={{ animationDelay: '400ms' }}>
          <AddLinkDialog onAdd={handleAddLink} />
        </div>

        {/* Links List with Staggered Reveal */}
        <div className="mt-6 flex w-full flex-col gap-4">
          {links.map((link, index) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-reveal group block w-full"
              style={{ animationDelay: `${(index + 1) * 100 + 400}ms` }}
            >
              <Card className="glass overflow-hidden border-border/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-primary/10">
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Icon Wrapper */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 shadow-inner transition-transform group-hover:scale-110">
                    {link.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={link.icon}
                        alt={`${link.title} icon`}
                        className="h-7 w-7 drop-shadow-sm"
                        width={28}
                        height={28}
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-muted" />
                    )}
                  </div>
                  
                  {/* Title & Click Count */}
                  <div className="flex flex-1 flex-col truncate">
                    <span className="text-[17px] font-bold tracking-tight text-foreground/90">{link.title}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
                       {link.clicks.toLocaleString()} clicks
                    </span>
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/40 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <RiArrowRightSLine size={24} />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* Footer Branding */}
        <footer className="mt-20 animate-reveal" style={{ animationDelay: '800ms' }}>
          <div className="flex items-center gap-2 opacity-40 transition-opacity hover:opacity-100">
            <span className="text-xs font-bold uppercase tracking-widest">MyLink.me</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
