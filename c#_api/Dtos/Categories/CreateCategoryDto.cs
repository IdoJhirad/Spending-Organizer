using System.ComponentModel.DataAnnotations;

namespace c__api.Dtos.Categories
{
    public class CreateCategoryDto
    {
        [Required]
        public string CategoryName { get; set; } = string.Empty;
        public bool IsDefault { get; set; } = true;

    }
}
