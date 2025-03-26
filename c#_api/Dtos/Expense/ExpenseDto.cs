using System.ComponentModel.DataAnnotations.Schema;
using c__api.Dtos.Categories;
using c__api.Models;

namespace c__api.Dtos.Expense
{
    public class ExpenseDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public CategoryDto? Category { get; set; }

    }
}
