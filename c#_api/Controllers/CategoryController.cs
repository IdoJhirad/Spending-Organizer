using c__api.Data;
using c__api.Interfaces;
using c__api.Utils.Mappers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace c__api.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepo;
        public CategoryController(ICategoryRepository categoryRepository)
        {
            _categoryRepo = categoryRepository;
        }
        [HttpGet]
        public async Task<IActionResult> GetDefaultCategory()
        {
            var categories = await _categoryRepo.GetAllDefaultCategoriesAsync();
            var categoriesDto = categories.Select(c=>c.CategoryModelToDto()).ToList();
            return Ok(categoriesDto);
        }



    }
}
