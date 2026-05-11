"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserData } from "@/types";
import { User } from "firebase/auth";

export const USER_QUERY_KEY = ["user-data"];

export function useUserData(user: User | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      if (!user) return null;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        return userDocSnap.data() as UserData;
      } else {
        // 신규 유저 초기 데이터 생성
        const newUserData: UserData = {
          username: user.displayName || "이름 없음",
          displayName: user.email ? user.email.split("@")[0] : "user_" + user.uid.slice(0, 5),
          bio: "새로운 마이링크가 생성되었습니다. 나만의 멋진 소개글을 적어주세요!",
          photoURL: user.photoURL || "",
        };
        await setDoc(userDocRef, newUserData);
        return newUserData;
      }
    },
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ field, value }: { field: keyof UserData; value: string }) => {
      if (!user) throw new Error("User not authenticated");
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        [field]: value,
      });
      return { field, value };
    },
    // 낙관적 업데이트 구현
    onMutate: async ({ field, value }) => {
      // 진행 중인 리페칭 취소
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY });

      // 이전 값 백업
      const previousUserData = queryClient.getQueryData<UserData>(USER_QUERY_KEY);

      // 캐시를 새 값으로 즉시 업데이트
      if (previousUserData) {
        queryClient.setQueryData<UserData>(USER_QUERY_KEY, {
          ...previousUserData,
          [field]: value,
        });
      }

      return { previousUserData };
    },
    // 에러 발생 시 롤백
    onError: (err, variables, context) => {
      if (context?.previousUserData) {
        queryClient.setQueryData(USER_QUERY_KEY, context.previousUserData);
      }
    },
    // 성공/실패 여부와 상관없이 서버와 동기화 (필요한 경우)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });

  return {
    userData: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
