import { auth } from "../firebase.js";

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json" };

  // 로그인 상태면 Firebase ID 토큰을 항상 붙인다. 서버는 이 토큰에서 신원을 얻는다.
  const account = auth?.currentUser;
  if (account) {
    headers.Authorization = `Bearer ${await account.getIdToken()}`;
  }

  const res = await fetch(`/api${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 204) {
    return null;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "요청 처리 중 문제가 발생했습니다.");
  }

  return data;
}

export const api = {
  // 신원은 토큰에서 나오므로 userId를 따로 넘기지 않는다.
  getMyProfile: () => request("/auth/me"),
  signupFisher: (payload) =>
    request("/auth/signup/fisher", { method: "POST", body: payload }),
  signupConsumer: (payload) =>
    request("/auth/signup/consumer", { method: "POST", body: payload }),
  updateProfile: (payload) =>
    request("/auth/profile", { method: "PUT", body: payload }),
  updateFisherProfile: (payload) =>
    request("/auth/fisher", { method: "PUT", body: payload }),

  listHarvest: () => request("/harvest"),
  addHarvest: (payload) =>
    request("/harvest", { method: "POST", body: payload }),
  updateHarvest: (id, payload) =>
    request(`/harvest/${id}`, { method: "PUT", body: payload }),
  deleteHarvest: (id) => request(`/harvest/${id}`, { method: "DELETE" }),

  listMaintenance: () => request("/maintenance"),
  addMaintenance: (payload) =>
    request("/maintenance", { method: "POST", body: payload }),
  updateMaintenance: (id, payload) =>
    request(`/maintenance/${id}`, { method: "PUT", body: payload }),
  deleteMaintenance: (id) =>
    request(`/maintenance/${id}`, { method: "DELETE" }),

  listMarket: (speciesId) =>
    request(`/market${speciesId ? `?speciesId=${speciesId}` : ""}`),
  getMarketListing: (id) => request(`/market/${id}`),
  listMyListings: () => request("/market/mine"),
  addListing: (payload) =>
    request("/market", { method: "POST", body: payload }),
  deleteListing: (id) => request(`/market/${id}`, { method: "DELETE" }),
  purchaseListing: (id) =>
    request(`/market/${id}/purchase`, { method: "POST" }),
  getQuote: (speciesId, period) =>
    request(`/market/quotes/${speciesId}?period=${period}`),
  getMarketMeta: () => request("/market/meta/rankings"),
  listMyPurchases: () => request("/market/purchases"),
  rateListing: (id, score) =>
    request(`/market/${id}/rating`, { method: "POST", body: { score } }),

  getFisherProfile: (id) => request(`/fishers/${id}`),
  searchFishers: (q) => request(`/fishers?q=${encodeURIComponent(q ?? "")}`),
  listFollowing: () => request("/fishers/following"),
  followFisher: (fisherId) =>
    request(`/fishers/${fisherId}/follow`, { method: "POST" }),
  unfollowFisher: (fisherId) =>
    request(`/fishers/${fisherId}/follow`, { method: "DELETE" }),
};
