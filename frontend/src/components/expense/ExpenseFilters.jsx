import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ExpenseFilters = ({ filters, onFilterChange, categories }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <TextField
        name="startDate"
        label="Start Date"
        type="date"
        value={filters.startDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 200 }}
      />
      
      <TextField
        name="endDate"
        label="End Date"
        type="date"
        value={filters.endDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 200 }}
      />

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Category</InputLabel>
        <Select
          name="categoryId"
          value={filters.categoryId}
          onChange={handleChange}
          label="Category"
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        name="minAmount"
        label="Min Amount"
        type="number"
        value={filters.minAmount}
        onChange={handleChange}
        sx={{ minWidth: 150 }}
      />

      <TextField
        name="maxAmount"
        label="Max Amount"
        type="number"
        value={filters.maxAmount}
        onChange={handleChange}
        sx={{ minWidth: 150 }}
      />
    </Box>
  );
};

export default ExpenseFilters; 