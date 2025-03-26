using c__api.Dtos.Expense;
using c__api.Models;
using c__api.Utils.Helpers;

namespace c__api.Interfaces
{
    public interface IExpenseRepository
    {
        public Task<List<Expense>> GetAllExpensesAsync(QueryObject query, AppUser user);
        public Task<Expense?> GetExpenseByIdAsync(int expensId, AppUser user);
        public Task<Expense> CreateAsync(Expense expense);
        public Task<Expense?> UpdateExpenseAsync(int expensId, UpdateExpenseDto expenseDto, AppUser user);
        public Task<Expense?> DeleteAsync(int id, AppUser user);
    }
}
