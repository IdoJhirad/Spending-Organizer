using Microsoft.AspNetCore.Identity;

namespace c__api.Models
{
    public class AppUser : IdentityUser
    {
        public string? Name { get; set; }
        public List<Expense> Expenses { get; set; } = new List<Expense>();
        public List<UserCategory> UserCategories { get; set; } = new List<UserCategory>();
    }
}
