import React, { useState, useEffect } from 'react';
import {
  Grid, Container, Typography, Box, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Snackbar, Alert, Divider, Paper, Chip, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditIcon from '@mui/icons-material/Edit';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import ExpenseSummary from '../components/dashboard/ExpenseSummary';
import RecentExpenses from '../components/dashboard/RecentExpenses';
import ExpenseForm from '../components/expense/ExpenseForm';
import expenseService from '../services/expenseService';
import categoryService from '../services/categoryService';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const DashboardPage = () => {
  const navigate = useNavigate();

  // Month navigation: viewMonth is the first day of the displayed month
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState([]); // limits only, from API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [slideDir, setSlideDir] = useState('left'); // 'left' = next, 'right' = prev

  const [budgetDialog, setBudgetDialog] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ categoryId: '', categoryName: '', budgetLimit: '' });
  const [expenseDialog, setExpenseDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const fetchDashboardData = async (month) => {
    try {
      setIsLoading(true);
      const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
      const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);
      const query = `?fromDate=${startDate.toISOString()}&toDate=${endDate.toISOString()}`;

      const [expensesData, categoriesData, budgetData] = await Promise.all([
        expenseService.getAllExpenses(query),
        categoryService.getCategories(),
        categoryService.getBudgets(), // always current month from backend — we use limits only
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
      setBudgetLimits(budgetData); // store as limits reference
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(viewMonth);
  }, [viewMonth]);

  const goToPrevMonth = () => {
    setSlideDir('right');
    setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const goToNextMonth = () => {
    const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
    if (next <= new Date()) {
      setSlideDir('left');
      setViewMonth(next);
    }
  };
  const isCurrentMonth = viewMonth.getFullYear() === new Date().getFullYear()
    && viewMonth.getMonth() === new Date().getMonth();

  // Compute per-category spending from the fetched expenses (respects selected month)
  const categoryCards = budgetLimits.map(b => {
    const spent = expenses
      .filter(e => e.category?.id === b.categoryId)
      .reduce((sum, e) => sum + e.amount, 0);
    return { ...b, spent };
  });

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleCategoryClick = (b) => {
    setBudgetForm({
      categoryId: b.categoryId,
      categoryName: b.categoryName,
      budgetLimit: b.budgetLimit != null ? String(b.budgetLimit) : '',
    });
    setBudgetDialog(true);
  };

  const handleAddExpense = async (formData) => {
    try {
      await expenseService.createExpense(formData);
      setExpenseDialog(false);
      showNotification('Expense added');
      fetchDashboardData(viewMonth);
    } catch (err) {
      showNotification('Failed to add expense', 'error');
    }
  };

  const handleAddCategory = async () => {
    try {
      await categoryService.createCategory(newCategoryName);
      if (newCategoryLimit) {
        const cats = await categoryService.getCategories();
        const created = cats.find(c => c.categoryName.toLowerCase() === newCategoryName.toLowerCase());
        if (created) await categoryService.setBudget(created.id, parseFloat(newCategoryLimit));
      }
      setCategoryDialog(false);
      setNewCategoryName('');
      setNewCategoryLimit('');
      showNotification('Category created');
      fetchDashboardData(viewMonth);
    } catch (err) {
      showNotification('Failed to create category', 'error');
    }
  };

  const handleSetBudget = async () => {
    try {
      await categoryService.setBudget(budgetForm.categoryId, parseFloat(budgetForm.budgetLimit));
      setBudgetDialog(false);
      showNotification('Budget updated');
      fetchDashboardData(viewMonth);
    } catch (err) {
      showNotification('Failed to update budget', 'error');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>

      {/* Title + Month Navigator — stays fixed, does not slide */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Dashboard</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={goToPrevMonth} size="small"><ChevronLeftIcon /></IconButton>
          <Typography variant="h6" sx={{ minWidth: 160, textAlign: 'center' }}>
            {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </Typography>
          <IconButton onClick={goToNextMonth} size="small" disabled={isCurrentMonth}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Everything below slides when the month changes */}
      <div
        key={`${viewMonth.getFullYear()}-${viewMonth.getMonth()}`}
        className={slideDir === 'left' ? 'slide-from-right' : 'slide-from-left'}
        style={{ overflow: 'hidden' }}
      >

      {/* Total for the month */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, display: 'inline-block', minWidth: 220 }}>
        <Typography variant="body2" color="text.secondary">Total spent this month</Typography>
        <Typography variant="h5" fontWeight="bold">${totalSpent.toFixed(2)}</Typography>
        <Typography variant="caption" color="text.secondary">
          {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
        </Typography>
      </Paper>

      {/* Action buttons */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setExpenseDialog(true)}>
          Add Expense
        </Button>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setCategoryDialog(true)}>
          Add Category
        </Button>
        <Button variant="outlined" startIcon={<ListAltIcon />} onClick={() => navigate('/expenses')}>
          All Expenses
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Categories section */}
      <Typography variant="h6" gutterBottom>
        Categories
        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          — click any to set a budget limit
        </Typography>
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {categoryCards.map((b) => {
          const hasLimit = b.budgetLimit != null;
          const pct = hasLimit ? (b.spent / b.budgetLimit) * 100 : 0;
          const overBudget = hasLimit && pct > 100;
          const nearLimit = hasLimit && !overBudget && pct >= 60;
          const barPct = Math.min(pct, 100);
          const barColor = overBudget ? '#d32f2f' : nearLimit ? '#ed6c02' : '#2e7d32';
          const borderColor = overBudget ? 'error.main' : nearLimit ? 'warning.main' : 'divider';

          return (
            <Grid item xs={6} sm={4} md={3} key={b.categoryId}>
              <Paper
                elevation={2}
                onClick={() => handleCategoryClick(b)}
                sx={{
                  p: 2, cursor: 'pointer', border: '2px solid', borderColor, borderRadius: 2,
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: 'primary.main', boxShadow: 3 },
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="body1" fontWeight="bold" noWrap sx={{ flex: 1 }}>
                    {b.categoryName}
                  </Typography>
                  <EditIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 0.5, mt: 0.3 }} />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Spent: <strong>${b.spent.toFixed(2)}</strong>
                </Typography>

                {hasLimit ? (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      Limit: ${b.budgetLimit.toFixed(2)}
                    </Typography>
                    <Box sx={{ mt: 1, height: 6, bgcolor: 'grey.200', borderRadius: 3, overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${barPct}%`, bgcolor: barColor, borderRadius: 3 }} />
                    </Box>
                    {overBudget && (
                      <Chip
                        label={`Over by $${(b.spent - b.budgetLimit).toFixed(2)}`}
                        color="error" size="small" sx={{ mt: 0.5 }}
                      />
                    )}
                    {nearLimit && (
                      <Chip
                        label={`$${(b.budgetLimit - b.spent).toFixed(2)} left`}
                        color="warning" size="small" sx={{ mt: 0.5 }}
                      />
                    )}
                    {!overBudget && !nearLimit && (
                      <Chip
                        label={`$${(b.budgetLimit - b.spent).toFixed(2)} left`}
                        color="success" size="small" sx={{ mt: 0.5 }}
                      />
                    )}
                  </>
                ) : (
                  <Typography variant="caption" color="text.disabled">No limit set</Typography>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ExpenseSummary expenses={expenses} categories={categories} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentExpenses expenses={expenses} />
        </Grid>
      </Grid>

      </div>{/* end sliding content */}

      {/* Add Expense Dialog */}
      <Dialog open={expenseDialog} onClose={() => setExpenseDialog(false)} maxWidth="sm" fullWidth>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>Add Expense</Typography>
          <ExpenseForm categories={categories} onSubmit={handleAddExpense} isLoading={false} />
        </Box>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={categoryDialog} onClose={() => { setCategoryDialog(false); setNewCategoryName(''); setNewCategoryLimit(''); }} maxWidth="xs" fullWidth>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Category Name" value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)} sx={{ mt: 1, mb: 2 }} />
          <TextField fullWidth label="Monthly Limit ($) — optional" type="number"
            value={newCategoryLimit} onChange={(e) => setNewCategoryLimit(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCategoryDialog(false); setNewCategoryName(''); setNewCategoryLimit(''); }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCategory} disabled={!newCategoryName.trim()}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Set Budget Dialog */}
      <Dialog open={budgetDialog} onClose={() => setBudgetDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Set Budget — {budgetForm.categoryName}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Monthly Limit ($)" type="number"
            value={budgetForm.budgetLimit}
            onChange={(e) => setBudgetForm(prev => ({ ...prev, budgetLimit: e.target.value }))}
            sx={{ mt: 1 }} autoFocus
            onKeyDown={(e) => e.key === 'Enter' && budgetForm.budgetLimit && handleSetBudget()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBudgetDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSetBudget} disabled={!budgetForm.budgetLimit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}>
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default DashboardPage;
