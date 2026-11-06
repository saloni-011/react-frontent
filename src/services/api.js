/**
 * TaskFlow API Client
 * Wraps native fetch with auth headers, error handling, and backend connectivity checks.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Retrieve auth token from localStorage
 */
export const getToken = () => localStorage.getItem('taskflow_token');

/**
 * Save auth token to localStorage
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('taskflow_token', token);
  } else {
    localStorage.removeItem('taskflow_token');
  }
};

/**
 * Common request wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (isJson && data?.error) ||
        (isJson && data?.message) ||
        `Request failed with status ${response.status} (${response.statusText})`;

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // If the network call failed completely (e.g. backend server is down or CORS failed)
    if (err.name === 'TypeError' && err.message.toLowerCase().includes('fetch')) {
      const serverHost = BASE_URL.replace('/api', '');
      const networkError = new Error(
        `Cannot connect to backend server at ${serverHost}. Please ensure the WA-2 backend server is running.`
      );
      networkError.isNetworkError = true;
      throw networkError;
    }
    throw err;
  }
}

/**
 * Authentication Endpoints
 */
export const authApi = {
  login: async ({ email, password }) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async ({ name, email, password }) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  getCurrentUser: async () => {
    return request('/auth/me', {
      method: 'GET'
    });
  }
};

/**
 * Tasks Endpoints
 */
export const tasksApi = {
  getAll: async ({ status, search } = {}) => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') {
      params.append('status', status);
    }
    if (search && search.trim()) {
      params.append('search', search.trim());
    }

    const queryString = params.toString();
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;
    return request(endpoint, { method: 'GET' });
  },

  getById: async (id) => {
    return request(`/tasks/${id}`, { method: 'GET' });
  },

  create: async ({ title, description, status }) => {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description: description || undefined,
        status: status || 'PENDING'
      })
    });
  },

  update: async (id, { title, description, status }) => {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        description: description ?? '',
        status
      })
    });
  },

  patchStatus: async (id, status) => {
    return request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  delete: async (id) => {
    return request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }
};

/**
 * Health / Connection check
 */
export const healthApi = {
  check: async () => {
    try {
      const rootUrl = BASE_URL.replace('/api', '');
      const response = await fetch(`${rootUrl}/`, { method: 'GET' });
      return response.ok;
    } catch {
      return false;
    }
  }
};

