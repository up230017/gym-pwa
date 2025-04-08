import api from '../config/services';

export const getMethodPayment = async () => {
  try {
    const response = await api.get('/method_payment');
  } catch (error) {
    throw error;
  }
};

export const getMethodPaymentById = async (methodPaymentId) => {
  try {
    const response = await api.get(`/method_payment/${methodPaymentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postMethodPayment = async (methodPaymentData) => {
  try {
    const response = await api.post('/method_payment', methodPaymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putMethodPayment = async (methodPaymentId, methodPaymentData) => {
  try {
    const response = await api.put(`/method_payment/${methodPaymentId}`, methodPaymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMethodPayment = async (methodPaymentId) => {
  try {
    await api.delete(`/method_payment/${methodPaymentId}`);
  } catch (error) {
    throw error;
  }
};