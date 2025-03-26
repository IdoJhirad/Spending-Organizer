using System.ComponentModel.DataAnnotations.Schema;

namespace c__api.Models
{
    [Table("Categories")]
    public class CategoryModel
    {
        public int Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public bool IsDefault { get; set; } = false;
        public List<UserCategory> UserCategories { get; set; } = new List<UserCategory>();

    }
}
