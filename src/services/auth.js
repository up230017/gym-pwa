import api from '../config/services';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    response.data != null ? console.log(response.data) : console.log("no hubo nada ");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const refreshToken = async (token) => {
  try {
    const response = await api.post('/auth/refresh-token', { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

refreshToken