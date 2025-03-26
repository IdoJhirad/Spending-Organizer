using c__api.Data;
using c__api.Interfaces;
using c__api.Models;
using Microsoft.EntityFrameworkCore;

namespace c__api.Repos
{
    public class CategoryRepo : ICategoryRepository
    {
      
        private readonly ApplicationDBContext _context;
        public CategoryRepo(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<CategoryModel> CreateCategoryAsync(CategoryModel model)
        {
            await _context.Categories.AddAsync(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<UserCategory> CreateUserCategoryAsync(UserCategory userCategory)
        {
            await _context.UserCategories.AddAsync(userCategory);
            await _context.SaveChangesAsync();  
            return userCategory;
        }

        public async Task<List<CategoryModel>> GetAllDefaultCategoriesAsync()
        {
            return await _context.Categories.Where(c => c.IsDefault == true).ToListAsync();
        }

        public async Task<CategoryModel?> GetCategoryByNameAsync(string name )
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.CategoryName == name);
        }



        public async Task<List<CategoryModel>> GetDefaultAndUserCategoryAsync(AppUser user)
        {
            var defaultCategories = await _context.Categories.Where(c => c.IsDefault == true).ToListAsync();
            var userCategoty = await _context.UserCategories.Where(u => u.AppUserId == user.Id)
                .Select(category => new CategoryModel
                {
                    Id = category.CategoryModelId,
                    CategoryName = category.CategoryModel.CategoryName,
                    IsDefault = category.CategoryModel.IsDefault
                }).ToListAsync();

            var allCategories = defaultCategories.Concat(userCategoty)
                //remove duplicated
                .GroupBy(c => c.Id).Select(g => g.First()).ToList();
            
            return allCategories;
        }

        public async Task<CategoryModel?> GetDefaultCategoryByIdAsync(int id)
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.IsDefault == true && c.Id == id);
        }

        public async Task<bool> IsCategoryExistsAsync(int id)
        {
            return await _context.Categories.AnyAsync((c => c.Id == id &&  c.IsDefault == true));
        }

    }
}
