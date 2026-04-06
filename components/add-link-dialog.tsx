"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiAddLine } from "@remixicon/react";

interface AddLinkDialogProps {
  onAdd: (title: string, url: string) => void;
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    
    onAdd(title, formattedUrl);
    setTitle("");
    setUrl("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="group relative w-full overflow-hidden border-border/50 bg-white/5 py-10 transition-all duration-500 hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_20px_-5px_oklch(var(--primary)/0.3)]"
        >
          {/* Background Gradient Shine Animation */}
          <div className="absolute inset-0 translate-x-[-100%] bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
          
          <div className="relative flex flex-col items-center gap-1">
            <span className="text-xl font-black tracking-tight text-foreground/90 transition-colors group-hover:text-primary">새로운 링크 추가</span>
            <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-[0.2em]">Add New Connection</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="glass sm:max-w-md border-white/10 overflow-hidden">
        {/* Decorative Background Decorative Blobs */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl opacity-50" />

        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-black tracking-tight bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            새 링크 추가
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-medium pt-1">연결하고 싶은 새로운 채널의 정보를 입력하세요.</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="relative space-y-6 py-6">
          <div className="space-y-2.5">
            <Label htmlFor="title" className="text-[11px] font-black uppercase tracking-[0.15em] text-primary/70">링크 제목</Label>
            <Input
              id="title"
              placeholder="예: 공식 인스타그램"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-base font-medium placeholder:text-muted-foreground/30"
              required
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="url" className="text-[11px] font-black uppercase tracking-[0.15em] text-primary/70">대상 URL</Label>
            <Input
              id="url"
              placeholder="예: instagram.com/my_page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-base font-medium placeholder:text-muted-foreground/30"
              required
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="submit" className="w-full h-12 text-base font-black shadow-lg shadow-primary/20 active:scale-95 transition-all">
              목록에 추가하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
