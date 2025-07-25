import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  CircularProgress,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpenseCard from '../components/expense/ExpenseCard';
import ExpenseForm from '../components/expense/ExpenseForm';
import ExpenseFilters from '../components/expense/ExpenseFilters';
import expenseService from '../services/expenseService';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    categoryId: '',
    minAmount: '',
    maxAmount: ''
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      let query = '?';
      if (filters.startDate) query += `&startDate=${filters.startDate}`;
      if (filters.endDate) query += `&endDate=${filters.endDate}`;
      if (filters.categoryId) query += `&categoryId=${filters.categoryId}`;
      if (filters.minAmount) query += `&minAmount=${filters.minAmount}`;
      if (filters.maxAmount) query += `&maxAmount=${filters.maxAmount}`;
      
      const data = await expenseService.getAllExpenses(query);
      setExpenses(data);
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // TODO: Fetch categories
    // const fetchCategories = async () => {
    //   const data = await categoryService.getAllCategories();
    //   setCategories(data);
    // };
    // fetchCategories();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setOpenForm(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setOpenForm(true);
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      await fetchExpenses();
      showNotification('Expense deleted successfully');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleSubmitExpense = async (formData) => {
    try {
      if (selectedExpense) {
        await expenseService.updateExpense(selectedExpense.id, formData);
        showNotification('Expense updated successfully');
      } else {
        await expenseService.createExpense(formData);
        showNotification('Expense created successfully');
      }
      setOpenForm(false);
      await fetchExpenses();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Expenses</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddExpense}
        >
          Add Expense
        </Button>
      </Box>

      <ExpenseFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
      />

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {expenses.map((expense) => (
            <Grid item xs={12} sm={6} md={4} key={expense.id}>
              <ExpenseCard
                expense={expense}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {selectedExpense ? 'Edit Expense' : 'Add New Expense'}
          </Typography>
          <ExpenseForm
            initialData={selectedExpense}
            categories={categories}
            onSubmit={handleSubmitExpense}
            isLoading={isLoading}
          />
        </Box>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ExpensesPage; 