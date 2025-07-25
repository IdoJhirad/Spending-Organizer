import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';

const RecentExpenses = ({ expenses }) => {
  const sortedExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Recent Expenses
      </Typography>
      <List>
        {sortedExpenses.map((expense) => (
          <ListItem key={expense.id} divider>
            <ListItemText
              primary={expense.description}
              secondary={`${expense.category?.categoryName} • ${new Date(expense.date).toLocaleDateString()}`}
            />
            <ListItemSecondaryAction>
              <Typography variant="body2" color="primary">
                ${expense.amount.toFixed(2)}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecentExpenses; 