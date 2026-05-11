"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { LinkData } from "@/types";
import { User } from "firebase/auth";

export const LINKS_QUERY_KEY = ["links"];

export function useLinks(user: User | null) {
  const queryClient = useQueryClient();

  const linksQuery = useQuery({
    queryKey: LINKS_QUERY_KEY,
    queryFn: async () => {
      if (!user) return [];
      const userDocRef = doc(db, "users", user.uid);
      const linksCollectionRef = collection(userDocRef, "link");
      const q = query(linksCollectionRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as LinkData[];
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (newLink: Omit<LinkData, "id" | "clicks">) => {
      if (!user) throw new Error("User not authenticated");
      const userDocRef = doc(db, "users", user.uid);
      const linksCollectionRef = collection(userDocRef, "link");
      const docRef = await addDoc(linksCollectionRef, {
        ...newLink,
        clicks: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, title, url, icon }: { id: string; title: string; url: string; icon: string }) => {
      if (!user) throw new Error("User not authenticated");
      const linkDocRef = doc(db, "users", user.uid, "link", id);
      await updateDoc(linkDocRef, {
        title,
        url,
        icon,
        updatedAt: serverTimestamp(),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");
      const linkDocRef = doc(db, "users", user.uid, "link", id);
      await deleteDoc(linkDocRef);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY });
    },
  });

  return {
    links: linksQuery.data || [],
    isLoading: linksQuery.isLoading,
    isError: linksQuery.isError,
    addLink: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateLink: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteLink: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
