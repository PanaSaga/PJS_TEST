import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const scoresRef = collection(db, "scores");

// 기록 저장: 닉네임과 반응속도(ms)를 scores 컬렉션에 추가한다.
export async function saveScore(nickname, ms) {
  await addDoc(scoresRef, {
    nickname,
    ms,
    createdAt: serverTimestamp(),
  });
}

// 랭킹 조회: 반응속도가 빠른(ms가 작은) 순으로 상위 n개를 반환한다.
export async function getTop(n) {
  const q = query(scoresRef, orderBy("ms", "asc"), limit(n));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}
