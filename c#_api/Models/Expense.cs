using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace c__api.Models
{
    // TODO -- ADD TYPE!!
    [Table("Expenses")]
    public class Expense
    {
        public int Id { get; set; }

        [Column(TypeName ="decimal(15,2)")]
        [DataType(DataType.Currency)]
        public decimal Amount { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;  
        public string Description { get; set; } = string.Empty;


        public string? AppUserId { get; set; }
        public AppUser? AppUser { get; set; }

        public int? CategoryModelId { get; set; }
        public CategoryModel? Category { get; set; }
    }
}
