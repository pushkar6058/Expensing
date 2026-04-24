const API_BASE = 'http://localhost:3000/api';

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || response.statusText);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const tripsApi = {
  getAll: () => fetchJSON(`${API_BASE}/trips`),
  getById: (id) => fetchJSON(`${API_BASE}/trips/${id}`),
  create: (data) => fetchJSON(`${API_BASE}/trips`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => fetchJSON(`${API_BASE}/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchJSON(`${API_BASE}/trips/${id}`, { method: 'DELETE' }),
};

export const expensesApi = {
  getByTripId: (tripId) => fetchJSON(`${API_BASE}/expenses/trip/${tripId}`),
  create: (tripId, data) => fetchJSON(`${API_BASE}/expenses/trip/${tripId}`, { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => fetchJSON(`${API_BASE}/expenses/${id}`, { method: 'DELETE' }),
};