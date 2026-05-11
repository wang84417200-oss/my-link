"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  RiPencilLine, 
  RiDeleteBinLine, 
  RiCheckLine, 
  RiCloseLine,
  RiArrowRightSLine,
  RiLoader4Line
} from "@remixicon/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Zod 유효성 검사 스키마 (AddLinkDialog와 동일)
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

interface LinkData {
  id: string;
  title: string;
  url: string;
  icon?: string;
  clicks: number;
  createdAt?: any;
  updatedAt?: any;
}

interface LinkCardProps {
  link: LinkData;
  index: number;
  onUpdate: (id: string, title: string, url: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function LinkCard({ link, index, onUpdate, onDelete }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  });

  const handleUpdate = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const formattedUrl = values.url.startsWith("http")
        ? values.url
        : `https://${values.url}`;
      await onUpdate(link.id, values.title, formattedUrl);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update link:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(link.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete link:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div 
        className="animate-reveal w-full"
        style={{ animationDelay: `${(index + 1) * 100 + 400}ms` }}
      >
        <Card className="glass overflow-hidden border-primary/30 shadow-primary/10">
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="제목"
                          className="h-10 bg-muted/40 border-border focus:border-primary font-bold rounded-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="URL"
                          className="h-10 bg-muted/40 border-border focus:border-primary font-medium rounded-lg"
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] font-bold text-destructive" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 h-10 font-bold bg-primary text-primary-foreground rounded-lg"
                  >
                    {isSubmitting ? (
                      <RiLoader4Line className="h-4 w-4 animate-spin" />
                    ) : (
                      <RiCheckLine className="h-4 w-4 mr-1" />
                    )}
                    저장
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset();
                    }}
                    className="flex-1 h-10 font-bold border-border bg-white/5 rounded-lg"
                  >
                    <RiCloseLine className="h-4 w-4 mr-1" />
                    취소
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="animate-reveal group block w-full relative"
      style={{ animationDelay: `${(index + 1) * 100 + 400}ms` }}
    >
      <Card className="glass overflow-hidden border-border/5 transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10">
        <CardContent className="flex items-center gap-4 p-4">
          {/* Link Icon */}
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 shadow-inner transition-transform hover:scale-110"
          >
            {link.icon ? (
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
          </a>
          
          {/* Title & Click Count */}
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-1 flex-col truncate"
          >
            <span className="text-[17px] font-bold tracking-tight text-foreground/90">{link.title}</span>
            <span className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
               {link.clicks.toLocaleString()} clicks
            </span>
          </a>
          
          {/* Actions - Always Visible */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-9 w-9 rounded-full text-muted-foreground/60 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <RiPencilLine size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="h-9 w-9 rounded-full text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <RiDeleteBinLine size={18} />
            </Button>
            <div className="ml-1 h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground/20">
              <RiArrowRightSLine size={20} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md border-border bg-background/98 backdrop-blur-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight text-foreground">
              정말 삭제하시겠습니까?
            </DialogTitle>
            <div className="pt-4 pb-2">
              <p className="text-base text-foreground/80">
                "{link.title}" 링크를 삭제합니다.
              </p>
              <p className="mt-2 text-sm text-destructive">
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-6"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6"
            >
              {isDeleting ? (
                <RiLoader4Line className="h-4 w-4 animate-spin" />
              ) : (
                "삭제하기"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
