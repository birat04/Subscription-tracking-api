const BASE = '/api/auth';

export const authService = {
  signUp: (data: unknown) =>
    fetch(`${BASE}/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  signIn: (data: unknown) =>
    fetch(`${BASE}/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  signOut: () => fetch(`${BASE}/sign-out`, { method: 'POST' }).then((r) => r.json()),

  me: () => fetch(`${BASE}/me`).then((r) => r.json()),
};
