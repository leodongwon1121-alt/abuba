async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    method: options.method ?? 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || '요청 처리 중 문제가 발생했습니다.');
  }

  return data;
}

export const api = {
  signupFisher: (payload) => request('/auth/signup/fisher', { method: 'POST', body: payload }),
  signupConsumer: (payload) => request('/auth/signup/consumer', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),

  listHarvest: (userId) => request(`/harvest?userId=${userId}`),
  addHarvest: (payload) => request('/harvest', { method: 'POST', body: payload }),
  updateHarvest: (id, payload) => request(`/harvest/${id}`, { method: 'PUT', body: payload }),
  deleteHarvest: (id, userId) => request(`/harvest/${id}?userId=${userId}`, { method: 'DELETE' }),

  updateFisherProfile: (id, payload) => request(`/auth/fisher/${id}`, { method: 'PUT', body: payload }),
  listMaintenance: (userId) => request(`/maintenance?userId=${userId}`),
  addMaintenance: (payload) => request('/maintenance', { method: 'POST', body: payload }),
  updateMaintenance: (id, payload) => request(`/maintenance/${id}`, { method: 'PUT', body: payload }),
  deleteMaintenance: (id, userId) => request(`/maintenance/${id}?userId=${userId}`, { method: 'DELETE' }),
};
