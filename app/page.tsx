"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  RiMore2Fill, 
  RiLoader4Line, 
  RiGoogleFill,
  RiLinksLine,
  RiPencilLine,
  RiLogoutBoxLine,
  RiArrowRightSLine,
  RiExternalLinkLine
} from "@remixicon/react";
import { AddLinkDialog } from "@/components/add-link-dialog";
import { LinkCard } from "@/components/link-card";
import { getFaviconUrl } from "@/lib/utils";
import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where,
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

import { InlineEditField } from "@/components/inline-edit-field";
import { LinkData, UserData } from "@/types";
import { useUserData } from "@/hooks/use-user-data";
import { useLinks } from "@/hooks/use-links";
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

// 로컬 인터페이스 정의 제거 (types/index에서 임포트됨)

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // TanStack Query 커스텀 훅 도입
  const { userData, isLoading: isUserLoading, updateProfile } = useUserData(user);
  const { links, isLoading: isLinksLoading, addLink, updateLink, deleteLink, isAdding } = useLinks(user);

  const isLoading = isUserLoading || isLinksLoading;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // displayName 중복 체크 함수 (Firestore 직접 조회 유지)
  const checkDisplayName = async (newDisplayName: string) => {
    if (newDisplayName === userData?.displayName) return null;
    
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("displayName", "==", newDisplayName));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return "이미 사용 중인 주소입니다.";
    }
    
    if (!/^[a-z0-9-]+$/.test(newDisplayName)) {
      return "영소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.";
    }
    
    if (newDisplayName.length < 3) {
      return "최소 3자 이상 입력해 주세요.";
    }

    return null;
  };

  const handleUpdateProfile = async (field: keyof UserData, value: string) => {
    const trimmedValue = value.trim();
    if (userData?.[field] === trimmedValue) return;

    try {
      updateProfile({ field, value: trimmedValue })
        .then(() => {
          toast.success("프로필이 업데이트되었습니다.");
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
          toast.error("업데이트 중 오류가 발생했습니다.");
        });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("업데이트 중 오류가 발생했습니다.");
      throw error;
    }
  };

  const handleAddLink = async (title: string, url: string) => {
    const icon = getFaviconUrl(url);
    try {
      await addLink({ title, url, icon });
      toast.success("새 링크가 추가되었습니다.");
    } catch (error) {
      console.error("Error adding link: ", error);
      toast.error("링크 추가 중 오류가 발생했습니다.");
    }
  };

  const handleUpdateLink = async (id: string, title: string, url: string) => {
    const targetLink = links.find(l => l.id === id);
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (targetLink && targetLink.title === trimmedTitle && targetLink.url === trimmedUrl) {
      return;
    }

    try {
      const icon = getFaviconUrl(trimmedUrl);
      await updateLink({ id, title: trimmedTitle, url: trimmedUrl, icon });
      toast.success("링크가 업데이트되었습니다.");
    } catch (error) {
      console.error("Error updating link: ", error);
      toast.error("링크 업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteLink(id);
      toast.success("링크가 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting link: ", error);
      toast.error("링크 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 초기 인증 상태 또는 유저 데이터 로딩 중
  if (isAuthLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <RiLoader4Line className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="relative min-h-svh flex flex-col items-center justify-center p-6 bg-background selection:bg-primary/30">
        <div className="flex max-w-md flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-tr from-primary to-violet-500 shadow-xl shadow-primary/20">
            <span role="img" aria-label="링크" className="text-4xl text-white">🔗</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            MyLink
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            나만의 멋진 멀티링크 프로필을 만들어보세요.<br/>
            구글 계정으로 간편하게 시작할 수 있습니다.
          </p>
          <button 
            onClick={handleLogin}
            className="mt-4 flex h-12 w-full max-w-[280px] items-center justify-center gap-3 rounded-full bg-foreground px-6 font-semibold text-background transition-transform hover:scale-[1.02] active:scale-95"
          >
            <RiGoogleFill className="h-5 w-5" />
            Google로 시작하기
          </button>
        </div>
      </div>
    );
  }

  // 로그인 후 마이페이지 화면
  return (
    <div className="relative min-h-svh overflow-hidden selection:bg-primary/30">
      
      {/* Global Overlays */}
      <Toaster position="top-center" richColors />

      {/* Header for Admin (MyPage) */}
      <header className="fixed top-0 left-0 z-40 flex w-full items-center justify-center bg-background/80 backdrop-blur-md border-b border-border/10">
        <div className="flex w-full max-w-md items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "/"}>
            <span className="text-2xl font-black tracking-tighter text-primary">MyLink</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`/${userData?.displayName}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-sm shadow-primary/20 transition-all group active:scale-95"
            >
              <RiExternalLinkLine className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">내 페이지</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full ring-offset-2 ring-offset-background transition-all hover:scale-105 active:scale-95">
                <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 bg-muted">
                  {userData?.photoURL ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={userData.photoURL} alt="프로필" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
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
                    className="cursor-pointer gap-3 py-3 px-3 rounded-xl transition-all focus:bg-primary/10 focus:text-primary group"
                    onClick={() => {
                      window.open(`/${userData?.displayName}`, '_blank');
                    }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 group-focus:bg-primary/20 transition-colors">
                      <RiArrowRightSLine className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[13px]">내 페이지 보기</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer gap-3 py-3 px-3 rounded-xl transition-all focus:bg-primary/10 focus:text-primary group"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/${userData?.displayName}`);
                      toast.success("링크가 복사 되었습니다");
                    }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 group-focus:bg-primary/20 transition-colors">
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

      {/* Add Loading Indicator Overlay */}
      {isAdding && (
        <div className="fixed top-20 left-1/2 z-50 flex -translate-x-1/2 animate-in fade-in slide-in-from-top-4 items-center gap-3 rounded-full border border-primary/20 bg-background/80 px-5 py-2.5 font-bold text-primary shadow-2xl backdrop-blur-xl">
          <RiLoader4Line className="h-5 w-5 animate-spin" />
          <span className="text-[14px] tracking-tight">새로운 링크를 추가하는 중...</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-6 pt-28 pb-20">
        
        {/* Profile Section */}
        <div className="flex animate-reveal flex-col items-center text-center">
          {/* Avatar with Premium Border */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-linear-to-tr from-primary to-violet-500 opacity-75 blur-sm transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-card ring-4 ring-background/50 text-5xl">
              {userData?.photoURL ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={userData.photoURL} alt="프로필" className="h-full w-full object-cover" />
              ) : (
                <span role="img" aria-label="프로필">🧑‍💻</span>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex flex-col items-center gap-1">
            {userData && (
              <>
                <InlineEditField
                  value={userData.username}
                  onSave={(val) => handleUpdateProfile("username", val)}
                  placeholder="이름을 입력해 주세요"
                  textClassName="text-2xl font-black tracking-tight text-foreground"
                />
                
                <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-muted/30 border border-border/5">
                  <span className="text-[15px] font-bold text-muted-foreground/70 tracking-tight">
                    @{userData.displayName}
                  </span>
                </div>

                <InlineEditField
                  value={userData.bio || ""}
                  onSave={(val) => handleUpdateProfile("bio", val)}
                  placeholder="소개글을 입력해 주세요"
                  className="mt-3"
                  textClassName="max-w-[320px] text-sm leading-relaxed text-muted-foreground/80"
                />
              </>
            )}
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-10 w-full animate-reveal" style={{ animationDelay: '400ms' }}>
          <AddLinkDialog onAdd={handleAddLink} />
        </div>

        {/* Links List with Staggered Reveal */}
        <div className="mt-6 flex w-full flex-col gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="glass overflow-hidden border-border/5">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="h-4 w-32 animate-pulse rounded-md bg-black/5 dark:bg-white/5" />
                    <div className="h-3 w-16 animate-pulse rounded-md bg-black/5 dark:bg-white/5" />
                  </div>
                  <div className="h-8 w-8 animate-pulse rounded-full bg-black/5 dark:bg-white/5" />
                </CardContent>
              </Card>
            ))
          ) : links.length > 0 ? (
            links.map((link, index) => (
              <LinkCard 
                key={link.id}
                link={link}
                index={index}
                onUpdate={handleUpdateLink}
                onDelete={handleDeleteLink}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
              <RiMore2Fill className="h-8 w-8 opacity-20" />
              <p className="text-sm">아직 등록된 링크가 없습니다.</p>
            </div>
          )}
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
