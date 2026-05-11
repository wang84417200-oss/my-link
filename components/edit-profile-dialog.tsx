"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { toast } from "sonner";

const profileSchema = z.object({
  username: z
    .string()
    .min(1, "이름을 입력해 주세요.")
    .max(20, "20자 이내로 입력해 주세요."),
  displayName: z
    .string()
    .min(3, "최소 3자 이상 입력해 주세요.")
    .max(20, "20자 이내로 입력해 주세요.")
    .regex(/^[a-z0-9-]+$/, "영소문자, 숫자, 하이픈(-)만 사용할 수 있습니다."),
  bio: z.string().max(100, "소개글은 100자 이내로 입력해 주세요.").optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uid: string;
  initialData: ProfileFormValues;
  onSuccess: (newData: ProfileFormValues) => void;
}

export function EditProfileDialog({ open, onOpenChange, uid, initialData, onSuccess }: EditProfileDialogProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (open) {
      form.reset(initialData);
    }
  }, [open, initialData, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      if (values.displayName !== initialData.displayName) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("displayName", "==", values.displayName));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          form.setError("displayName", {
            type: "manual",
            message: "이미 사용 중인 주소입니다. 다른 주소를 입력해 주세요.",
          });
          return;
        }
      }

      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        username: values.username,
        displayName: values.displayName,
        bio: values.bio || "",
      });

      toast.success("프로필이 성공적으로 수정되었습니다.");
      onSuccess(values);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-background/98 backdrop-blur-2xl shadow-2xl overflow-hidden selection:bg-primary/30">
        {/* Decorative Background Decorative Blobs - Matching AddLinkDialog */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/5 blur-3xl opacity-30" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-violet-500/5 blur-3xl opacity-30" />

        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
            프로필 정보 수정
          </DialogTitle>
          <p className="text-[15px] text-muted-foreground font-medium pt-1">
            공개될 프로필 정보를 자유롭게 변경하세요.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-6 py-6 transition-all">
            
            <FormField
              control={form.control}
              name="displayName"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full transition-colors ${fieldState.error ? "bg-destructive" : "bg-primary"}`} />
                    URL 슬러그 (고유 주소)
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-muted-foreground/60 font-black text-lg">@</span>
                      <Input
                        placeholder="my-link-id"
                        className={`pl-10 h-13 bg-muted/40 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base font-semibold placeholder:text-muted-foreground/40 rounded-xl ${fieldState.error ? "border-destructive focus:border-destructive animate-shake" : ""}`}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[13px] font-bold text-destructive px-1 animate-reveal" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full transition-colors ${fieldState.error ? "bg-destructive" : "bg-primary"}`} />
                    이름 (닉네임)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="김철수"
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
              name="bio"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-foreground/80 flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full transition-colors ${fieldState.error ? "bg-destructive" : "bg-primary"}`} />
                    소개글
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="간단한 자기소개를 적어주세요."
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
                  "수정사항 저장하기"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
