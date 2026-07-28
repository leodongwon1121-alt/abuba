import { COLLECTIONS, db } from "../firebase.js";

function col() {
  return db.collection(COLLECTIONS.follows);
}

// 문서 ID를 "consumerId_fisherId"로 고정하면 중복 팔로우가 구조적으로 막힌다.
function keyOf(consumerId, fisherId) {
  return `${consumerId}_${fisherId}`;
}

export async function isFollowing(consumerId, fisherId) {
  if (!consumerId || !fisherId) return false;
  const snap = await col().doc(keyOf(consumerId, fisherId)).get();
  return snap.exists;
}

export async function follow(consumerId, fisherId) {
  await col()
    .doc(keyOf(consumerId, fisherId))
    .set({
      consumerId: String(consumerId),
      fisherId: String(fisherId),
      createdAt: new Date().toISOString(),
    });
  return true;
}

export async function unfollow(consumerId, fisherId) {
  await col().doc(keyOf(consumerId, fisherId)).delete();
  return true;
}

export async function listFollowing(consumerId) {
  const snap = await col().where("consumerId", "==", String(consumerId)).get();
  return snap.docs.map((doc) => doc.data().fisherId);
}

export async function countFollowers(fisherId) {
  const snap = await col()
    .where("fisherId", "==", String(fisherId))
    .count()
    .get();
  return snap.data().count;
}
