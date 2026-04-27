"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RiArrowRightSLine, RiShareLine, RiMore2Fill, RiLoader4Line } from "@remixicon/react";
import { AddLinkDialog } from "@/components/add-link-dialog";
import { LinkCard } from "@/components/link-card";
import { getFaviconUrl } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  orderBy, 
  query, 
  serverTimestamp,
  updateDoc,
  deleteDoc 
} from "firebase/firestore";

interface LinkData {
  id: string;
  title: string;
  url: string;
  icon?: string;
  clicks: number;
  createdAt?: any;
}

export default function Page() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        const userDocRef = doc(db, "users", "anonymous");
        const linksCollectionRef = collection(userDocRef, "links");
        const q = query(linksCollectionRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        
        const fetchedLinks = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as LinkData[];
        
        setLinks(fetchedLinks);
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const handleAddLink = async (title: string, url: string) => {
    setIsAdding(true);
    const icon = getFaviconUrl(url);
    const newLinkData = {
      title,
      url,
      icon,
      clicks: 0,
      createdAt: serverTimestamp(),
    };
    
    try {
      const userDocRef = doc(db, "users", "anonymous");
      const linksCollectionRef = collection(userDocRef, "links");
      const docRef = await addDoc(linksCollectionRef, newLinkData);
      
      const addedLink: LinkData = { 
        id: docRef.id, 
        ...newLinkData, 
        createdAt: new Date() 
      };
      
      setLinks([addedLink, ...links]);
    } catch (error) {
      console.error("Error adding link: ", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateLink = async (id: string, title: string, url: string) => {
    try {
      const icon = getFaviconUrl(url);
      const linkDocRef = doc(db, "users", "anonymous", "links", id);
      
      await updateDoc(linkDocRef, {
        title,
        url,
        icon,
      });

      // 로컬 상태 업데이트 (갱신형)
      setLinks(prev => prev.map(link => 
        link.id === id ? { ...link, title, url, icon } : link
      ));
    } catch (error) {
      console.error("Error updating link: ", error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const linkDocRef = doc(db, "users", "anonymous", "links", id);
      await deleteDoc(linkDocRef);

      // 로컬 상태 업데이트 (갱신형)
      setLinks(prev => prev.filter(link => link.id !== id));
    } catch (error) {
      console.error("Error deleting link: ", error);
    }
  };

  return (
    <div className="relative min-h-svh overflow-hidden selection:bg-primary/30">
      {/* Add Loading Indicator Overlay */}
      {isAdding && (
        <div className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 animate-in fade-in slide-in-from-top-4 items-center gap-3 rounded-full border border-primary/20 bg-background/80 px-5 py-2.5 font-bold text-primary shadow-2xl backdrop-blur-xl">
          <RiLoader4Line className="h-5 w-5 animate-spin" />
          <span className="text-[14px] tracking-tight">새로운 링크를 추가하는 중...</span>
        </div>
      )}

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
          ) : (
            links.map((link, index) => (
              <LinkCard 
                key={link.id}
                link={link}
                index={index}
                onUpdate={handleUpdateLink}
                onDelete={handleDeleteLink}
              />
            ))
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
