import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const { amount, description, date, category } = expense;

  return (
    <Card sx={{ mb: 2, position: 'relative' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" component="div">
              ${amount.toFixed(2)}
            </Typography>
            <Typography color="text.secondary">
              {description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="primary">
              {category?.categoryName}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={() => onEdit(expense)} size="small" color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(expense.id)} size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard; 