using c__api.Models;

namespace c__api.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<CategoryModel>> GetAllDefaultCategoriesAsync();
        Task<CategoryModel?> GetDefaultCategoryByIdAsync(int id);
        Task<CategoryModel?> GetCategoryByNameAsync(string name);
        Task<bool> IsCategoryExistsAsync(int id);

        Task<List<CategoryModel>> GetDefaultAndUserCategoryAsync(AppUser user);
        Task<CategoryModel> CreateCategoryAsync(CategoryModel model);
        Task<UserCategory> CreateUserCategoryAsync(UserCategory userCategory);
    }
}
