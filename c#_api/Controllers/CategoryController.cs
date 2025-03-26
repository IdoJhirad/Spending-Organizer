using c__api.Data;
using c__api.Dtos.Categories;
using c__api.Interfaces;
using c__api.Models;
using c__api.Utils.Helpers;
using c__api.Utils.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Validations;

namespace c__api.Controllers
{
    [Route("api/category")]
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepo;
        private readonly UserManager<AppUser> _userManager;
        private readonly IExpenseRepository _expenseRepository;

        public CategoryController(ICategoryRepository categoryRepository, UserManager<AppUser> userManager, IExpenseRepository expenseRepository)
        {
            _categoryRepo = categoryRepository;
            _userManager = userManager;
            _expenseRepository = expenseRepository;
        }

        [HttpGet("default")]
        public async Task<IActionResult> GetDefaultCategory()
        {
            var categories = await _categoryRepo.GetAllDefaultCategoriesAsync();
            var categoriesDto = categories.Select(c=>c.CategoryModelToDto()).ToList();
            return Ok(categoriesDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetUserCategories()
        {
            var appUser = await User.GetAppUserAsync(_userManager);
            if (appUser == null)
            {
                return BadRequest("User Doesnt exsist");
            }
            var categories = await _categoryRepo.GetDefaultAndUserCategoryAsync(appUser);
            var categoryDtos = categories.Select(c => c.CategoryModelToDto()).ToList();

            return Ok(categoryDtos);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUserCAtegory([FromBody] CreateCategoryDto categoryDto)
        {
            var appUser = await User.GetAppUserAsync(_userManager);
            if (appUser == null)
            {
                return BadRequest("User Doesnt exsist");
            }
            //check if user have category
            var userCategoty = await _categoryRepo.GetDefaultAndUserCategoryAsync(appUser);
            if (userCategoty.Any(c => c.CategoryName.ToLower() == categoryDto.CategoryName.ToLower()))
            {
                return BadRequest("category already exsist in user categories");
            }
            // get or create the category
            var category = await _categoryRepo.GetCategoryByNameAsync(categoryDto.CategoryName);
            if (category == null)
            {
                category = await _categoryRepo.CreateCategoryAsync(categoryDto.DtoToCategoryModel());
            }

            //create user category
            var newUserCategory = new UserCategory
            {
                AppUserId = appUser.Id,
                CategoryModelId = category.Id,
            };

            await _categoryRepo.CreateUserCategoryAsync(newUserCategory);

            return Created();

        }

    }
}
