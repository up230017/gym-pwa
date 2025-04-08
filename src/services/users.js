import api from '../config/services';

export const getUsers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/users', { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users.');
  }
};

export const getUserById = async (userId) => {
  if (!userId) throw new Error('User ID is required.');

  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw new Error('Failed to fetch user.');
  }
};

export const postUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user.');
  }
};

export const putUser = async (userId, userData) => {
  if (!userId) throw new Error('User ID is required.');

  try {
    const response = await api.put(`/users/${userId}`, userData);
    if (response.status !== 200) throw new Error('Failed to update user.');

    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    throw new Error('Failed to update user.');
  }
};

export const deleteUser = async (userId) => {
  if (!userId) throw new Error('User ID is required.');

  try {
    await api.delete(`/users/${userId}`);
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw new Error('Failed to delete user.');
  }
};