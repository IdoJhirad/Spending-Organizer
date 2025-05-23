﻿using c__api.Data;
using c__api.Dtos.Expense;
using c__api.Interfaces;
using c__api.Models;
using c__api.Utils.Helpers;
using Microsoft.EntityFrameworkCore;

namespace c__api.Repos
{
    public class ExpenseRepo : IExpenseRepository
    {
        private readonly ApplicationDBContext _context;
        public ExpenseRepo(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Expense>> GetAllExpensesAsync(QueryObject query, AppUser user)
        {
            var expenses =  _context.Expense.Where(e => e.AppUserId == user.Id).Include(c => c.Category).AsQueryable();
            //with exstention where if
            expenses = expenses.WhereIf(query.CategoryId.HasValue && query.CategoryId.Value >= 1, e => e.CategoryModelId == query.CategoryId.Value);

            expenses = expenses.WhereIf(query.FromDate.HasValue, e => e.Date >= query.FromDate.Value)
                .WhereIf(query.ToDate.HasValue, e => e.Date <= query.ToDate.Value);
  
            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                if (query.SortBy.Equals("Amount", StringComparison.OrdinalIgnoreCase))
                {
                    expenses = query.IsDecsending ? expenses.OrderByDescending(e => e.Amount) : expenses.OrderBy(e => e.Amount);
                }
                else if (query.SortBy.Equals("Date", StringComparison.OrdinalIgnoreCase))
                {
                    expenses = query.IsDecsending ? expenses.OrderByDescending(e => e.Date) : expenses.OrderBy(e => e.Date);
                }
            }
            return await expenses.ToListAsync();           
        }
   
        public async Task<Expense?> GetExpenseByIdAsync(int expensId, AppUser user)
        {
            return await _context.Expense.Include(e => e.Category).FirstOrDefaultAsync(e => e.Id == expensId && e.AppUserId == user.Id);
        }

        public async Task<Expense?> UpdateExpenseAsync(int expensId, UpdateExpenseDto expenseDto, AppUser user)
        {
            var expense = await _context.Expense.Include(e => e.Category).FirstOrDefaultAsync(e => e.Id == expensId && e.AppUserId == user.Id);
            if (expense == null)
            {
                return null;
            }
            expense.Amount = expenseDto.Amount;
            expense.Description = expenseDto.Description;
            expense.CategoryModelId = expenseDto.CategoryId; 

            await _context.SaveChangesAsync();
            await _context.Entry(expense).Reference(e => e.Category).LoadAsync();

            return expense; 
        }
        public async Task<Expense> CreateAsync(Expense expense)
        {
            await _context.Expense.AddAsync(expense);
            await _context.SaveChangesAsync();
            await _context.Entry(expense).Reference(e => e.Category).LoadAsync();
            return expense;
        }

        public async Task<Expense?> DeleteAsync(int expensId, AppUser user)
        {
            var expense = await _context.Expense.FirstOrDefaultAsync(e => e.Id == expensId && e.AppUserId == user.Id);
            if (expense == null)
            {
                return null;
            }
            _context.Expense.Remove(expense);
            await _context.SaveChangesAsync();
            return expense;
        }
    }
}
