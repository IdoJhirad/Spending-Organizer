using c__api.Dtos.Expense;
using c__api.Models;
using c__api.Utils.Helpers;

namespace c__api.Interfaces
{
    public interface IExpenseRepository
    {
        public Task<List<Expense>> GetAllExpensesAsync(QueryObject query);
        public Task<Expense?> GetExpenseByIdAsync(int id);
        public Task<Expense> CreateAsync(Expense expense);
        public Task<Expense?> UpdateExpenseAsync(int id, UpdateExpenseDto expenseDto);
        public Task<Expense?> DeleteAsync(int id);
    }
}
