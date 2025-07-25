import apiClient from '../utils/axios';

const expenseService = {
  getAllExpenses: async (query = '') => {
    const response = await apiClient.get(`/expense${query}`);
    return response.data;
  },

  getExpenseById: async (id) => {
    const response = await apiClient.get(`/expense/${id}`);
    return response.data;
  },

  createExpense: async (expenseData) => {
    const response = await apiClient.post('/expense', expenseData);
    return response.data;
  },

  updateExpense: async (id, expenseData) => {
    const response = await apiClient.put(`/expense/${id}`, expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
    await apiClient.delete(`/expense/${id}`);
  }
};

export default expenseService; 