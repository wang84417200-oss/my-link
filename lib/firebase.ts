import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
// Next.js 개발 환경에서 Hot Reloading으로 인해 여러 번 초기화되는 것을 방지합니다.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics (브라우저 환경에서만 실행)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// 추후 연동될 Auth와 Firestore를 미리 초기화해둡니다.
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
