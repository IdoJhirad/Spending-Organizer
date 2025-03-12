using c__api.Models;

namespace c__api.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<CategoryModel>> GetAllDefaultCategoriesAsync();
        Task<CategoryModel?> GetDefaultCategoryByIdAsync(int id);

        Task<bool> IsCategoryExists(int id);
    }
}
