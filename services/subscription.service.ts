const BASE = '/api/subscriptions';

export const subscriptionService = {
  getAll: (page = 1, limit = 10) =>
    fetch(`${BASE}?page=${page}&limit=${limit}`).then((r) => r.json()),

  getById: (id: string) => fetch(`${BASE}/${id}`).then((r) => r.json()),

  create: (data: unknown) =>
    fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  update: (id: string, data: unknown) =>
    fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  delete: (id: string) => fetch(`${BASE}/${id}`, { method: 'DELETE' }).then((r) => r.json()),

  cancel: (id: string) => fetch(`${BASE}/${id}/cancel`, { method: 'POST' }).then((r) => r.json()),

  renew: (id: string) => fetch(`${BASE}/${id}/renew`, { method: 'POST' }).then((r) => r.json()),
};
