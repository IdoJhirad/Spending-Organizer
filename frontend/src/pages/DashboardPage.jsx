import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography, Box, CircularProgress } from '@mui/material';
import ExpenseSummary from '../components/dashboard/ExpenseSummary';
import RecentExpenses from '../components/dashboard/RecentExpenses';
import expenseService from '../services/expenseService';

const DashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
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
        
        const query = `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
        const expensesData = await expenseService.getAllExpenses(query);
        setExpenses(expensesData);
        
        // TODO: Add category service and fetch categories
        // const categoriesData = await categoryService.getAllCategories();
        // setCategories(categoriesData);
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