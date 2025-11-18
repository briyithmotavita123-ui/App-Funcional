// frontend/src/api/api.js
import axios from 'axios';

/**
 * Instancia de Axios para conectar con el backend.
 * La URL base debe coincidir con donde corre el backend (puerto 3000).
 */
const API = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para incluir el token en cada solicitud si el usuario está logueado
API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default API;