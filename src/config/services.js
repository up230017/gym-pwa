import axios from 'axios';

// Crear instancia de Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // URL base del backend
});

// Interceptor para agregar el token a cada solicitud
api.interceptors.request.use(
  (config) => {
    // Obtener el token desde las cookies
    const token = document.cookie.split('; ').find((row) => row.startsWith('token='));
    if (token) {
      config.headers.Authorization = `Bearer ${token.split('=')[1]}`;
    } else {
      console.warn('No se encontró el token en las cookies.');
    }
    return config;
  },
  (error) => {
    console.error('Error en el interceptor de solicitud:', error.message);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y refrescar el token si es necesario
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, simplemente devuélvela
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 (Unauthorized) y no hemos intentado refrescar aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marcar la solicitud como reintentada

      const refreshToken = document.cookie.split('; ').find((row) => row.startsWith('refreshToken='));
      if (refreshToken) {
        try {
          // Solicitar un nuevo token usando el token de refresco
          const response = await api.post('/auth/refresh-token', {
            token: refreshToken.split('=')[1],
          });

          // Guardar el nuevo token en las cookies
          document.cookie = `token=${response.data.token}; path=/;`;

          // Agregar el nuevo token al encabezado y reintentar la solicitud original
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Error al refrescar el token:', refreshError.message);
          return Promise.reject(refreshError);
        }
      } else {
        console.warn('No se encontró el refreshToken en las cookies.');
      }
    }

    // Si no es un error 401 o no se puede manejar, rechazar el error
    return Promise.reject(error);
  }
);

export default api;