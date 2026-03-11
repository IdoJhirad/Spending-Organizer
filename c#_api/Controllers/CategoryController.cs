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
using Microsoft.EntityFrameworkCore;

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
        private readonly ApplicationDBContext _context;

        public CategoryController(ICategoryRepository categoryRepository, UserManager<AppUser> userManager, IExpenseRepository expenseRepository, ApplicationDBContext context)
        {
            _categoryRepo = categoryRepository;
            _userManager = userManager;
            _expenseRepository = expenseRepository;
            _context = context;
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

        // GET /api/category/budgets — returns current month spending vs budget for all user categories
        [HttpGet("budgets")]
        public async Task<IActionResult> GetBudgetStatus()
        {
            var appUser = await User.GetAppUserAsync(_userManager);
            if (appUser == null) return BadRequest("User Doesnt exsist");

            var userCategories = await _categoryRepo.GetUserCategoriesWithBudgetAsync(appUser.Id);
            var allCategories = await _categoryRepo.GetDefaultAndUserCategoryAsync(appUser);

            var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            var now = DateTime.UtcNow;

            var result = new List<BudgetStatusDto>();

            foreach (var cat in allCategories)
            {
                var spent = await _context.Expense
                    .Where(e => e.AppUserId == appUser.Id
                             && e.CategoryModelId == cat.Id
                             && e.Date >= startOfMonth
                             && e.Date <= now
                             && e.DeletedAt == null)
                    .SumAsync(e => e.Amount);

                var userCat = userCategories.FirstOrDefault(uc => uc.CategoryModelId == cat.Id);

                result.Add(new BudgetStatusDto
                {
                    CategoryId = cat.Id,
                    CategoryName = cat.CategoryName,
                    BudgetLimit = userCat?.BudgetLimit,
                    Spent = spent
                });
            }

            return Ok(result);
        }

        // PUT /api/category/{id}/budget — set or update budget for a category
        [HttpPut("{id}/budget")]
        public async Task<IActionResult> SetBudget(int id, [FromBody] SetBudgetDto dto)
        {
            var appUser = await User.GetAppUserAsync(_userManager);
            if (appUser == null) return BadRequest("User Doesnt exsist");

            var userCat = await _categoryRepo.GetUserCategoryAsync(appUser.Id, id);
            if (userCat == null)
            {
                // for default categories, create a UserCategory entry so we can store the budget
                var categoryExists = await _categoryRepo.IsCategoryExistsAsync(id);
                if (!categoryExists) return NotFound("Category not found");

                userCat = new UserCategory
                {
                    AppUserId = appUser.Id,
                    CategoryModelId = id,
                    BudgetLimit = dto.BudgetLimit
                };
                await _categoryRepo.CreateUserCategoryAsync(userCat);
                return Ok();
            }

            userCat.BudgetLimit = dto.BudgetLimit;
            await _categoryRepo.SaveChangesAsync();
            return Ok();
        }

    }
}
