using System.ComponentModel.DataAnnotations;
using c__api.Models;

namespace c__api.Dtos.Expense
{
    public class UpdateExpenseDto
    {
        [Required]
        [Range(1, 1000000)]
        public decimal Amount { get; set; }

        [MaxLength(100, ErrorMessage = "Description can be over 100 characters")]
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; } = 1;

    }
}
