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
using Microsoft.EntityFrameworkCore.Update.Internal;
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

        [HttpGet]
        public async Task<IActionResult> GetUserCategories ()
        {
            var appUser = HttpContext.Items["User"] as AppUser;

            if (appUser == null)
            {
                return BadRequest("User Doesnt exsist");
            }

            var categories = await _categoryRepo.GetUserCategoriesAsync(appUser);

            var categoriesDto = categories.Select(c => c.CategoryModelToDto()).ToList();

            return Ok(categoriesDto);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetUserCategoryById(int id)
        {
            var appUser = HttpContext.Items["User"] as AppUser;

            if (appUser == null)
            {
                return BadRequest("User Doesnt exsist");
            }
            var catrgory = await _categoryRepo.GetUserCategoryByIdAsync(id, appUser);
            if(catrgory == null)
            {
                return NotFound("category not found.");
            }
            return Ok(catrgory.CategoryModelToDto());
        }

        [HttpPost]
        public async Task<IActionResult> CreateUserCategory([FromBody] CreateCategoryDto categoryDto)
        {
            var appUser = HttpContext.Items["User"] as AppUser;
            if (appUser == null)
            {
                return BadRequest("User Doesnt exsist");
            }

            //create user category
            var category = categoryDto.DtoToCategoryModel(appUser.Id);

            await _categoryRepo.CreateCategoryAsync(category);

            return Created();

        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCategoty(int id)
        {
            var appUser = HttpContext.Items["User"] as AppUser;
            if (appUser == null)
            {
                return BadRequest("User Doesnt exsist");
            }
            var categoty =  await _categoryRepo.DeleteAsync(id, appUser);
            if(categoty == null)
            {
                return NotFound("Category not found.");
            }
            return NoContent();
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto dto)
        {
            var appUser = HttpContext.Items["User"] as AppUser;
            if (appUser == null)
            {
                return BadRequest("User Doesnt exsist");
            }
            var category = await _categoryRepo.UpdateCategoryAsync(id, dto, appUser);
            if (category == null) 
            {
                return NotFound("Category not found.");
            }
            return Ok(category.CategoryModelToDto());
           
        }
    }
}
