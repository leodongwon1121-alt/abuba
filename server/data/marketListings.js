import { COLLECTIONS, db } from "../firebase.js";

function col() {
  return db.collection(COLLECTIONS.listings);
}

function toListing(doc) {
  return { id: doc.id, ...doc.data() };
}

export async function listAll(speciesId) {
  const query = speciesId ? col().where("speciesId", "==", speciesId) : col();
  const snap = await query.get();
  return snap.docs.map(toListing);
}

export async function listBySeller(sellerId) {
  const snap = await col().where("sellerId", "==", String(sellerId)).get();
  return snap.docs.map(toListing);
}

export async function listByBuyer(buyerId) {
  const snap = await col().where("buyerId", "==", String(buyerId)).get();
  return snap.docs.map(toListing);
}

export async function listOnSaleBySpecies(speciesId) {
  const snap = await col()
    .where("speciesId", "==", speciesId)
    .where("status", "==", "onSale")
    .get();
  return snap.docs.map(toListing);
}

export async function getById(id) {
  if (!id) return null;
  const snap = await col().doc(String(id)).get();
  return snap.exists ? toListing(snap) : null;
}

export async function addListing(listing) {
  const payload = {
    status: "onSale",
    ...listing,
    sellerId: String(listing.sellerId),
  };
  const ref = await col().add(payload);
  return { id: ref.id, ...payload };
}

export async function deleteListing(id, sellerId) {
  const ref = col().doc(String(id));
  const snap = await ref.get();
  if (!snap.exists || snap.data().sellerId !== String(sellerId)) {
    return false;
  }
  await ref.delete();
  return true;
}

// 주문번호는 여러 요청이 동시에 들어와도 겹치면 안 되므로 트랜잭션으로 발급한다.
async function nextOrderNo(tx) {
  const ref = db.collection(COLLECTIONS.counters).doc("orderNo");
  const snap = await tx.get(ref);
  const next = (snap.exists ? snap.data().value : 0) + 1;
  tx.set(ref, { value: next });
  return `ABB-${String(next).padStart(6, "0")}`;
}

export async function markSold(id, buyerId) {
  const ref = col().doc(String(id));

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists || snap.data().status === "sold") {
      return null;
    }

    const orderNo = await nextOrderNo(tx);
    const updates = {
      status: "sold",
      buyerId: String(buyerId),
      orderNo,
      purchasedAt: new Date().toISOString(),
    };
    tx.update(ref, updates);
    return { id: snap.id, ...snap.data(), ...updates };
  });
}
