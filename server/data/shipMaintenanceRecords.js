import { COLLECTIONS, db } from "../firebase.js";

function col() {
  return db.collection(COLLECTIONS.maintenance);
}

function toRecord(doc) {
  return { id: doc.id, ...doc.data() };
}

export async function listByUser(userId) {
  const snap = await col().where("userId", "==", String(userId)).get();
  return snap.docs.map(toRecord);
}

export async function addRecord(record) {
  const payload = { ...record, userId: String(record.userId) };
  const ref = await col().add(payload);
  return { id: ref.id, ...payload };
}

export async function updateRecord(id, userId, updates) {
  const ref = col().doc(String(id));
  const snap = await ref.get();
  if (!snap.exists || snap.data().userId !== String(userId)) {
    return null;
  }
  await ref.update(updates);
  return toRecord(await ref.get());
}

export async function deleteRecord(id, userId) {
  const ref = col().doc(String(id));
  const snap = await ref.get();
  if (!snap.exists || snap.data().userId !== String(userId)) {
    return false;
  }
  await ref.delete();
  return true;
}
