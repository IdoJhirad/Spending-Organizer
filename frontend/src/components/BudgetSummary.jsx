import React from 'react';
import { Box, Typography, LinearProgress, Paper, Grid, Chip } from '@mui/material';

const BudgetSummary = ({ budgets }) => {
  const categoriesWithBudget = budgets.filter(b => b.budgetLimit != null);

  if (categoriesWithBudget.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Budget Status</Typography>
        <Typography color="text.secondary" variant="body2">
          No budgets set. Use PUT /api/category/&#123;id&#125;/budget to set a budget for a category.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Budget Status — This Month</Typography>
      <Grid container spacing={2}>
        {categoriesWithBudget.map((b) => {
          const pct = Math.min((b.spent / b.budgetLimit) * 100, 100);
          const color = b.isOverBudget ? 'error' : b.isNearLimit ? 'warning' : 'success';

          return (
            <Grid item xs={12} sm={6} md={4} key={b.categoryId}>
              <Box sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="body2" fontWeight="bold">{b.categoryName}</Typography>
                  {b.isOverBudget && <Chip label="Over budget" color="error" size="small" />}
                  {b.isNearLimit && <Chip label="Near limit" color="warning" size="small" />}
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  color={color}
                  sx={{ height: 8, borderRadius: 4, mb: 0.5 }}
                />
                <Typography variant="caption" color="text.secondary">
                  ${b.spent.toFixed(2)} / ${b.budgetLimit.toFixed(2)}
                  {b.remaining != null && !b.isOverBudget && ` — $${b.remaining.toFixed(2)} left`}
                  {b.isOverBudget && ` — $${Math.abs(b.remaining).toFixed(2)} over`}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default BudgetSummary;
