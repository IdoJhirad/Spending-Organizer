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
    
        public async Task<List<CategoryModel>> GetAllDefaultCategoriesAsync()
        {
            return await _context.Categories.Where(c => c.IsDefault == true).ToListAsync();
        }

        public async Task<CategoryModel?> GetDefaultCategoryByIdAsync(int id)
        {
            return await _context.Categories.FirstOrDefaultAsync(c => c.IsDefault == true && c.Id == id);
        }

        public async Task<bool> IsCategoryExists(int id)
        {
            return await _context.Categories.AnyAsync(c => c.Id == id &&  c.IsDefault == true);
        }
    }
}
