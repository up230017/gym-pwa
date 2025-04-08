import api from '../config/services';

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.filter(response => response.parentId !== null);
  } catch (error) {
    throw error;
  }
};

export const getSubcategories = async () => {
    try {
      const response = await api.get('/categories');
    return response.filter(response => response.parentId === null);
    } catch (error) {
      throw error;
    }
  };

export const getCategorieById = async (categorieId) => {
  try {
    const response = await api.get(`/categories/${categorieId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postCategorie = async (categorieData) => {
  try {
    const response = await api.post('/categories', categorieData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putCategorie = async (categorieId, categorieData) => {
  try {
    const response = await api.put(`/categories/${categorieId}`, categorieData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategorie = async (categorieId) => {
  try {
    await api.delete(`/categories/${categorieId}`);
  } catch (error) {
    throw error;
  }
};