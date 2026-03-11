import apiClient from '../utils/axios';

const categoryService = {
  getCategories: async () => {
    const response = await apiClient.get('/api/category');
    return response.data;
  },

  getBudgets: async () => {
    const response = await apiClient.get('/api/category/budgets');
    return response.data;
  },

  setBudget: async (categoryId, budgetLimit) => {
    const response = await apiClient.put(`/api/category/${categoryId}/budget`, { budgetLimit });
    return response.data;
  },

  createCategory: async (categoryName) => {
    const response = await apiClient.post('/api/category', { categoryName });
    return response.data;
  },
};

export default categoryService;
