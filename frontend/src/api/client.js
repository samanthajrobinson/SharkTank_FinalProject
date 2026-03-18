const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers
    },
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }
  return data;
}

export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body })
};

export const outfitApi = {
  generate: (body, token) => request('/outfits/generate', { method: 'POST', body, token }),
  getAll: (token) => request('/outfits', { token }),
  create: (body, token) => request('/outfits', { method: 'POST', body, token }),
  update: (id, body, token) => request(`/outfits/${id}`, { method: 'PUT', body, token }),
  remove: (id, token) => request(`/outfits/${id}`, { method: 'DELETE', token })
};

export { API_URL };
