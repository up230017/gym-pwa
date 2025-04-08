import api from '../config/services';

export const getProduct = async () => {
  try {
    const response = await api.get('/product'); 
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/product/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postProduct = async (productData) => {
  try {
    const response = await api.post('/product', productData); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/product/${productId}`, productData); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await api.delete(`/product/${productId}`);
  } catch (error) {
    throw error;
  }
};