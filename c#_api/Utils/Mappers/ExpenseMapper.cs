using System.Runtime.CompilerServices;
using c__api.Dtos.Expense;
using c__api.Models;

namespace c__api.Utils.Mappers
{
    public static class ExpenseMapper
    {
        public static Expense DtoToExpense(this CreateExpenseDto expenseDto)
        {
            return new Expense
            {
                Amount = expenseDto.Amount,
                Description = expenseDto.Description,
                CategoryModelId = expenseDto.CategoryId,
            };
        }
        public static ExpenseDto ExpenseToDto(this Expense expense)
        {
            return new ExpenseDto
            {
                Id = expense.Id,
                Amount = expense.Amount,
                Description = expense.Description,
                Date = expense.Date,
                Category = expense.Category.CategoryModelToDto()

            };
        }
    }
}
