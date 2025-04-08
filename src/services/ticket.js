import api from '../config/services';

export const getTickets = async () => {
  try {
    const response = await api.get('/ticket');
  } catch (error) {
    throw error;
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const response = await api.get(`/ticket/${ticketId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postTicket = async (ticketData) => {
  try {
    const response = await api.post('/ticket', ticketData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putTicket = async (ticketId, ticketData) => {
  try {
    const response = await api.put(`/ticket/${ticketId}`, ticketData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    await api.delete(`/ticket/${ticketId}`);
  } catch (error) {
    throw error;
  }
};