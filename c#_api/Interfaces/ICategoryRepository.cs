using c__api.Dtos.Categories;
using c__api.Models;

namespace c__api.Interfaces
{
    public interface ICategoryRepository
    {
     

        Task<bool> IsCategoryExistsAsync(int id, AppUser appUser);

        Task<List<CategoryModel>> GetUserCategoriesAsync(AppUser user);
        Task<CategoryModel> CreateCategoryAsync(CategoryModel model);
        Task<CategoryModel?> GetUserCategoryByIdAsync(int id, AppUser appUser);
        Task<CategoryModel?> DeleteAsync(int expensId, AppUser user);
        Task<CategoryModel?> UpdateCategoryAsync(int expensId, UpdateCategoryDto updateDto,AppUser user);
    }
}
