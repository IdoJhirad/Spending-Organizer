using System.ComponentModel.DataAnnotations;

namespace c__api.Dtos.Categories
{
    public class UpdateCategoryDto
    {
        [Required]
        public string CategoryName { get; set; } = string.Empty;
        public string? Icon { get; set; }
    }
}
