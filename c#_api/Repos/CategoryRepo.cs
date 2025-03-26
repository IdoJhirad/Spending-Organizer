using c__api.Data;
using c__api.Dtos.Categories;
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


        public async Task<List<CategoryModel>> GetUserCategoriesAsync(AppUser user)
        {
            var categories = await _context.Categories.Where(c => c.AppUserId == user.Id).ToListAsync();
         
            return categories;
        }

        public async Task<CategoryModel?> GetUserCategoryByIdAsync(int id, AppUser appUser)
        {
           return await _context.Categories.FirstOrDefaultAsync(c => c.Id == id && c.AppUserId == appUser.Id);
        }

        public async Task<bool> IsCategoryExistsAsync(int id, AppUser appUser)
        {
            return await _context.Categories.AnyAsync((c => c.Id == id &&  c.AppUserId == appUser.Id));
        }
        public async Task<CategoryModel?> DeleteAsync(int id, AppUser user)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(e => e.Id == id && e.AppUserId == user.Id);
            if (category == null)
            {
                return null;
            }
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return category;
        }
        public async Task<CategoryModel?> UpdateCategoryAsync(int id, UpdateCategoryDto updateDto, AppUser appUser)
        {
         
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id && c.AppUserId == appUser.Id);
            if(category == null)
            {
                return null;
            }
            category.Icon = updateDto.Icon;
            category.CategoryName = updateDto.CategoryName;

            await _context.SaveChangesAsync();
            return category;
        }
    }
}
