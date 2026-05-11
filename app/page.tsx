"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RiShareLine, RiMore2Fill, RiLoader4Line, RiGoogleFill } from "@remixicon/react";
import { AddLinkDialog } from "@/components/add-link-dialog";
import { LinkCard } from "@/components/link-card";
import { getFaviconUrl } from "@/lib/utils";
import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  orderBy, 
  query, 
  serverTimestamp,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

interface LinkData {
  id: string;
  title: string;
  url: string;
  icon?: string;
  clicks: number;
  createdAt?: any;
  updatedAt?: any;
}

interface UserData {
  username: string;
  displayName: string;
  bio: string;
  photoURL: string;
}

export default function Page() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // 유저 문서 조회 또는 생성
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
        } else {
          // 신규 유저 초기 데이터
          const newUserData: UserData = {
            username: currentUser.displayName || "이름 없음",
            displayName: currentUser.email ? currentUser.email.split('@')[0] : "user_" + currentUser.uid.slice(0, 5),
            bio: "새로운 마이링크가 생성되었습니다. 나만의 멋진 소개글을 적어주세요!",
            photoURL: currentUser.photoURL || "",
          };
          await setDoc(userDocRef, newUserData);
          setUserData(newUserData);
        }
        
        // 링크 데이터 조회 (link 컬렉션으로 변경됨)
        fetchLinks(currentUser.uid);
      } else {
        setLinks([]);
        setUserData(null);
        setIsLoading(false);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchLinks = async (uid: string) => {
    try {
      setIsLoading(true);
      const userDocRef = doc(db, "users", uid);
      const linksCollectionRef = collection(userDocRef, "link");
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

  const handleAddLink = async (title: string, url: string) => {
    if (!user) return;
    setIsAdding(true);
    const icon = getFaviconUrl(url);
    const newLinkData = {
      title,
      url,
      icon,
      clicks: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      const linksCollectionRef = collection(userDocRef, "link");
      const docRef = await addDoc(linksCollectionRef, newLinkData);
      
      const addedLink: LinkData = { 
        id: docRef.id, 
        ...newLinkData, 
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setLinks([addedLink, ...links]);
    } catch (error) {
      console.error("Error adding link: ", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateLink = async (id: string, title: string, url: string) => {
    if (!user) return;
    try {
      const icon = getFaviconUrl(url);
      const linkDocRef = doc(db, "users", user.uid, "link", id);
      
      await updateDoc(linkDocRef, {
        title,
        url,
        icon,
        updatedAt: serverTimestamp(),
      });

      setLinks(prev => prev.map(link => 
        link.id === id ? { ...link, title, url, icon, updatedAt: new Date() } : link
      ));
    } catch (error) {
      console.error("Error updating link: ", error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!user) return;
    try {
      const linkDocRef = doc(db, "users", user.uid, "link", id);
      await deleteDoc(linkDocRef);

      setLinks(prev => prev.filter(link => link.id !== id));
    } catch (error) {
      console.error("Error deleting link: ", error);
    }
  };

  // 초기 인증 상태 로딩 중
  if (isAuthLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <RiLoader4Line className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 로그인 전 안내 화면
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
      {/* Header for Admin (MyPage) */}
      <header className="fixed top-0 left-0 z-40 flex w-full items-center justify-center bg-background/80 backdrop-blur-md border-b border-border/5">
        <div className="flex w-full max-w-md items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-black tracking-tighter">
            <span className="text-xl">🔗 MyLink</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            로그아웃
          </button>
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
          
          <div className="mt-6 flex flex-col gap-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              @{userData?.displayName || 'user'}
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              {userData?.username || '이름 없음'}
            </p>
          </div>
          
          <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-muted-foreground/80">
            {userData?.bio}
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
