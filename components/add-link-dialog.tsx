"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Zod 유효성 검사 스키마 정의
const formSchema = z.object({
  title: z
    .string()
    .min(1, "링크 제목을 입력해 주세요.")
    .max(20, "제목은 20자 이내로 입력해 주세요."),
  url: z
    .string()
    .min(1, "URL을 입력해 주세요.")
    .regex(
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i,
      "올바른 URL 형식이 아닙니다. (예: google.com)"
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface AddLinkDialogProps {
  onAdd: (title: string, url: string) => Promise<void>;
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);

  // React Hook Form 초기화
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    // URL이 http로 시작하지 않으면 https://를 붙여줌
    const formattedUrl = values.url.startsWith("http")
      ? values.url
      : `https://${values.url}`;

    await onAdd(values.title, formattedUrl);
    form.reset();
    setOpen(false);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="group relative w-full overflow-hidden border-border/50 bg-white/5 py-10 transition-all duration-500 hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_20px_-5px_oklch(var(--primary)/0.3)]"
        >
          {/* Background Gradient Shine Animation */}
          <div className="absolute inset-0 translate-x-[-100%] bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

          <div className="relative flex flex-col items-center gap-1">
            <span className="text-xl font-black tracking-tight text-foreground/90 transition-colors group-hover:text-primary">
              새로운 링크 추가
            </span>
            <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-[0.2em]">
              Add New Connection
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-border bg-background/98 backdrop-blur-2xl shadow-2xl overflow-hidden selection:bg-primary/30">
        {/* Decorative Background Decorative Blobs */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/5 blur-3xl opacity-30" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-violet-500/5 blur-3xl opacity-30" />

        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
            새 링크 추가
          </DialogTitle>
          <p className="text-[15px] text-muted-foreground font-medium pt-1">
            연결하고 싶은 새로운 채널의 정보를 입력하세요.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative space-y-6 py-6 transition-all"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full transition-colors ${fieldState.error ? "bg-destructive" : "bg-primary"}`} />
                    링크 제목
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="예: 공식 인스타그램"
                      className={`h-13 bg-muted/40 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base font-semibold placeholder:text-muted-foreground/40 px-4 rounded-xl ${fieldState.error ? "border-destructive focus:border-destructive animate-shake" : ""}`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[13px] font-bold text-destructive px-1 animate-reveal" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full transition-colors ${fieldState.error ? "bg-destructive" : "bg-primary"}`} />
                    대상 URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="예: instagram.com/my_page"
                      className={`h-13 bg-muted/40 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base font-semibold placeholder:text-muted-foreground/40 px-4 rounded-xl ${fieldState.error ? "border-destructive focus:border-destructive animate-shake" : ""}`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[13px] font-bold text-destructive px-1 animate-reveal" />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-14 text-lg font-black bg-primary text-primary-foreground shadow-[0_8px_16px_-4px_oklch(var(--primary)/0.3)] hover:shadow-[0_12px_20px_-4px_oklch(var(--primary)/0.4)] active:scale-95 transition-all rounded-xl flex items-center justify-center gap-2"
              >
                {form.formState.isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  "목록에 추가하기"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
