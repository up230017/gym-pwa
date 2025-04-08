import api from '../config/services';

export const getOrders = async () => {
  try {
    const response = await api.get('/order');
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/order/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postOrder = async (orderData) => {
  try {
    const response = await api.post('/order', orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putOrder = async (orderId, orderData) => {
  try {
    const response = await api.put(`/order/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    await api.delete(`/order/${orderId}`);
  } catch (error) {
    throw error;
  }
};