import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// .env에는 줄바꿈이 \n 문자열로 들어있으므로 실제 개행으로 되돌린다.
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const firebaseReady = Boolean(projectId && clientEmail && privateKey);

if (!firebaseReady) {
  console.warn(
    "[firebase] server/.env 설정이 없습니다. server/.env.example을 복사해 값을 채워주세요.",
  );
}

if (firebaseReady && getApps().length === 0) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const db = firebaseReady ? getFirestore() : null;
export const adminAuth = firebaseReady ? getAuth() : null;

export const COLLECTIONS = {
  users: "users",
  harvest: "harvestRecords",
  maintenance: "maintenanceRecords",
  listings: "marketListings",
  follows: "follows",
  ratings: "ratings",
  counters: "counters",
};
