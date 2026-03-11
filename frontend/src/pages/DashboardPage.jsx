import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography, Box, CircularProgress } from '@mui/material';
import ExpenseSummary from '../components/dashboard/ExpenseSummary';
import RecentExpenses from '../components/dashboard/RecentExpenses';
import BudgetSummary from '../components/BudgetSummary';
import expenseService from '../services/expenseService';
import apiClient from '../utils/axios';

const DashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Get current month's expenses
        const startDate = new Date();
        startDate.setDate(1);
        const endDate = new Date();
        
        const query = `?fromDate=${startDate.toISOString()}&toDate=${endDate.toISOString()}`;
        const expensesData = await expenseService.getAllExpenses(query);
        setExpenses(expensesData);

        const budgetData = await apiClient.get('/api/category/budgets');
        setBudgets(budgetData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BudgetSummary budgets={budgets} />
        </Grid>
        <Grid item xs={12} md={8}>
          <ExpenseSummary expenses={expenses} categories={categories} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentExpenses expenses={expenses} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage; 