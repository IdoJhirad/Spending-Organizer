using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace c__api.Models
{
    public class AppUser : IdentityUser
    {
        public string? Name { get; set; }
        public List<Expense> Expenses { get; set; } = new List<Expense>();

        [Column(TypeName = "decimal(15,2)")]
        [DataType(DataType.Currency)]
        public decimal Balance { get; set; } = 0m;
        public List<CategoryModel> Categories { get; set; } = new List<CategoryModel>();
    }
}
