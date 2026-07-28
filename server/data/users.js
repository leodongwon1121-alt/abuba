import { COLLECTIONS, db } from "../firebase.js";

// 문서 ID = Firebase Auth uid. 별도 숫자 id를 쓰지 않는다.
function col() {
  return db.collection(COLLECTIONS.users);
}

function toUser(doc) {
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

export async function findById(id) {
  if (!id) return null;
  return toUser(await col().doc(String(id)).get());
}

export async function findByEmail(email) {
  const snap = await col().where("email", "==", email).limit(1).get();
  return snap.empty ? null : toUser(snap.docs[0]);
}

export async function listByAccountType(accountType) {
  const snap = await col().where("accountType", "==", accountType).get();
  return snap.docs.map(toUser);
}

// uid는 Firebase Auth가 발급한 값을 그대로 문서 ID로 쓴다.
export async function createUser(uid, user) {
  const record = { ...user, createdAt: new Date().toISOString() };
  await col().doc(uid).set(record);
  return { id: uid, ...record };
}

export async function updateUser(id, updates) {
  const ref = col().doc(String(id));
  const snap = await ref.get();
  if (!snap.exists) {
    return null;
  }
  await ref.update(updates);
  return toUser(await ref.get());
}
