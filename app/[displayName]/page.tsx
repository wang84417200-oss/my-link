"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { collection, query, where, getDocs, doc, updateDoc, increment, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserData, LinkData } from "@/types";
import { RiLoader4Line, RiArrowRightSLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

export default function PublicProfilePage() {
  const params = useParams();
  const displayName = params.displayName as string;
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 유저 검색 (displayName 기준)
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("displayName", "==", displayName));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          notFound();
          return;
        }

        const userDoc = snapshot.docs[0];
        const data = userDoc.data() as UserData;

        // username이 없으면 요구사항에 따라 404
        if (!data.username) {
          notFound();
          return;
        }

        setUserData(data);
        setUserId(userDoc.id);

        // 2. 링크 조회 (users/{userId}/links)
        const linksRef = collection(db, "users", userDoc.id, "links");
        const linksQuery = query(linksRef, orderBy("createdAt", "desc"));
        const linksSnapshot = await getDocs(linksQuery);
        
        const fetchedLinks = linksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as LinkData[];
        
        setLinks(fetchedLinks);
      } catch (error) {
        console.error("Error fetching public data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (displayName) {
      fetchData();
    }
  }, [displayName]);

  const handleLinkClick = async (linkId: string, url: string) => {
    if (!userId) return;
    
    try {
      // 클릭 수 증가 (Background)
      const linkRef = doc(db, "users", userId, "links", linkId);
      updateDoc(linkRef, {
        clicks: increment(1)
      }).catch(err => console.error("Click increment failed:", err));
      
      // 새 창에서 이동
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error handling link click:", error);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <RiLoader4Line className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="relative min-h-svh bg-background selection:bg-primary/30 overflow-x-hidden">
      {/* Decorative Background Blobs */}
      <div className="fixed -top-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-[10%] -left-[10%] h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

      <main className="relative z-10 mx-auto flex w-full max-w-md md:max-w-2xl lg:max-w-3xl flex-col items-center px-6 pt-20 pb-20">
        
        {/* Profile Section */}
        <div className="flex animate-reveal flex-col items-center text-center">
          {/* Avatar with Premium Border */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-linear-to-tr from-primary to-violet-500 opacity-75 blur-sm" />
            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-card ring-4 ring-background/50 text-5xl">
              {userData.photoURL ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={userData.photoURL} alt="프로필" className="h-full w-full object-cover" />
              ) : (
                <span role="img" aria-label="프로필">🧑‍💻</span>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex flex-col gap-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              {userData.username}
            </h1>
            <p className="text-[15px] font-bold text-muted-foreground/70 tracking-tight">
              @{userData.displayName}
            </p>
          </div>
          
          <p className="mt-4 max-w-[300px] text-[15px] leading-relaxed text-muted-foreground/80 font-medium">
            {userData.bio}
          </p>
        </div>

        {/* Links List */}
        <div className="mt-12 flex w-full flex-col gap-4 animate-reveal" style={{ animationDelay: '200ms' }}>
          {links.length > 0 ? (
            links.map((link, index) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                className="group relative flex w-full items-center gap-4 rounded-2xl border border-border/40 bg-card/50 p-4 transition-all hover:scale-[1.02] hover:border-primary/30 hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm group-hover:shadow-md transition-shadow">
                  {link.icon ? (
                    <img
                      src={link.icon}
                      alt={`${link.title} icon`}
                      className="h-7 w-7 transition-transform group-hover:scale-110"
                      width={28}
                      height={28}
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-muted" />
                  )}
                </div>
                
                <span className="flex-1 text-left text-[16px] font-bold tracking-tight text-foreground/90">
                  {link.title}
                </span>
                
                <RiArrowRightSLine className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/40">
              <p className="text-sm font-bold">아직 등록된 링크가 없습니다.</p>
            </div>
          )}
        </div>

        {/* Footer Branding */}
        <footer className="mt-20 flex flex-col items-center gap-4 animate-reveal" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-2 opacity-30 transition-opacity hover:opacity-100 cursor-default">
            <span className="text-xs font-black uppercase tracking-widest">Powered by MyLink</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
