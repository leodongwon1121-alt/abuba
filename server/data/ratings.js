import { COLLECTIONS, db } from "../firebase.js";

function col() {
  return db.collection(COLLECTIONS.ratings);
}

// 별점은 "구매 건(listingId)" 하나에 1:1로 묶는다.
// 문서 ID를 listingId로 두면 같은 거래를 두 번 평가하는 게 구조적으로 막힌다.
export async function getByListing(listingId) {
  if (!listingId) return null;
  const snap = await col().doc(String(listingId)).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

export async function addRating({ listingId, fisherId, consumerId, score }) {
  const payload = {
    listingId: String(listingId),
    fisherId: String(fisherId),
    consumerId: String(consumerId),
    score,
    createdAt: new Date().toISOString(),
  };
  await col().doc(String(listingId)).set(payload);
  return { id: String(listingId), ...payload };
}

export async function listByFisher(fisherId) {
  const snap = await col().where("fisherId", "==", String(fisherId)).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function summary(fisherId) {
  const mine = await listByFisher(fisherId);
  if (mine.length === 0) {
    return { avg: null, count: 0 };
  }
  const total = mine.reduce((sum, r) => sum + r.score, 0);
  return {
    avg: Math.round((total / mine.length) * 10) / 10,
    count: mine.length,
  };
}
