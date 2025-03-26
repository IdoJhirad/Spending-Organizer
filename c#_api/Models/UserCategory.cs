using System.ComponentModel.DataAnnotations.Schema;

namespace c__api.Models
{
    [Table("UsersCategories")]
    public class UserCategory
    {
        public string AppUserId { get; set; }
        public int CategoryModelId {  get; set; }
        public AppUser AppUser { get; set; }
        public CategoryModel CategoryModel { get; set; } 

    }
}
