// src/utils/authFetch.js

export async function authFetch(url, options = {}) {
  const access = localStorage.getItem('access');
  const refresh = localStorage.getItem('refresh');

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${access}`,
    'Content-Type': 'application/json',
  };

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && refresh) {
    const refreshRes = await fetch('https://metrapp.onrender.com/usuarios/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem('access', data.access);

      headers.Authorization = `Bearer ${data.access}`;
      response = await fetch(url, { ...options, headers });
    } else {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/';
    }
  }

  return response;
}
