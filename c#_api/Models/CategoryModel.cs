using System.ComponentModel.DataAnnotations.Schema;

namespace c__api.Models
{
    [Table("Categories")]
    public class CategoryModel
    {
        public int Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        public string? Icon { get; set; }
        public string? AppUserId { get; set; }
        public AppUser? AppUser { get; set; }
    }
}
