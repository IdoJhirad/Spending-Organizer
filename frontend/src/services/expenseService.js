import apiClient from '../utils/axios';

const expenseService = {
  getAllExpenses: async (query = '') => {
    const response = await apiClient.get(`/api/expense${query}`);
    return response.data;
  },

  getExpenseById: async (id) => {
    const response = await apiClient.get(`/api/expense/${id}`);
    return response.data;
  },

  createExpense: async (expenseData) => {
    const response = await apiClient.post('/api/expense', expenseData);
    return response.data;
  },

  updateExpense: async (id, expenseData) => {
    const response = await apiClient.put(`/api/expense/${id}`, expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
    await apiClient.delete(`/api/expense/${id}`);
  }
};

export default expenseService; 