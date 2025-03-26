using System.Security.Claims;
using c__api.Data;
using c__api.Dtos.Expense;
using c__api.Interfaces;
using c__api.Models;
using c__api.Utils.Helpers;
using c__api.Utils.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace c__api.Controllers
{
    [Route("api/expense")]
    [ApiController]
    [Authorize]
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseRepository _expenseRepo;
        private readonly ICategoryRepository _categoryRepo;
        private readonly UserManager<AppUser> _userManager;
        private readonly ILogger<ExpenseController> _logger;
        public ExpenseController(IExpenseRepository expenseRepository, ICategoryRepository categoryRepository, UserManager<AppUser> userManager, ILogger<ExpenseController> logger)
        {
            _expenseRepo = expenseRepository;
            _categoryRepo = categoryRepository;
            _userManager = userManager;
            _logger = logger;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query)
        {
            _logger.LogInformation("entered to get all expenss");
            var appUser = HttpContext.Items["User"] as AppUser;
            if (appUser == null)
            {
                return BadRequest("User Doesnt exsist");
            }
            _logger.LogInformation($"get all exsepensess for user: {appUser.Email}");


            //var appUser = await User.GetAppUserAsync(_userManager);
            //if (appUser == null)
            //{
            //    return BadRequest("User Doesnt exsist");
            //}

            //Todo Add filter by CAtegory by dates by type that i will do
            var expense = await _expenseRepo.GetAllExpensesAsync(query, appUser);
              
            var expenseDto = expense.Select(e => e.ExpenseToDto()).ToList();

            return Ok(expenseDto);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)

        {
            var appUser = await User.GetAppUserAsync(_userManager);
            if (appUser == null)
            {
                return BadRequest("User Doesnt exsist");
            }
            _logger.LogInformation($"post expens for user: {appUser.Email}");
            var expense = await _expenseRepo.GetExpenseByIdAsync(id,appUser);
            if(expense == null)
            {
                return NotFound("expense not found");
            }
            return Ok(expense.ExpenseToDto());
        }

        [HttpPost]
        public async Task<IActionResult> CreateExpense([FromBody] CreateExpenseDto expenseDto)
        {
            var appUser = await User.GetAppUserAsync(_userManager);
            if (appUser == null)
            {
                return BadRequest("User Doesnt exsist");
            }
            var categoryExists = await _categoryRepo.IsCategoryExistsAsync(expenseDto.CategoryId);

            if (!categoryExists)
            {
                expenseDto.CategoryId = 1;
            }

            var expense = expenseDto.DtoToExpense(appUser);

            await _expenseRepo.CreateAsync(expense);
            return CreatedAtAction(nameof(GetById), new { id = expense.Id }, expense.ExpenseToDto());
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateExpense([FromRoute] int id, [FromBody] UpdateExpenseDto expenseDto)
        {
            var appUser = await User.GetAppUserAsync(_userManager);
            if (appUser == null)
            {
                return BadRequest("User Doesnt exsist");
            }

            var categoryExists = await _categoryRepo.IsCategoryExistsAsync(expenseDto.CategoryId);

            if (!categoryExists)
            {
                expenseDto.CategoryId = 1;
            }

            var expense = await _expenseRepo.UpdateExpenseAsync(id, expenseDto, appUser);

            if( expense == null)
            {
                return NotFound();
            }
           
            return Ok(expense.ExpenseToDto());
        }
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteExpense([FromRoute] int id)
        {
            var appUser = await User.GetAppUserAsync(_userManager);
            if (appUser == null)
            {
                return BadRequest("User Doesnt exsist");
            }

            var expense = await _expenseRepo.DeleteAsync(id, appUser);
            if (expense == null)
            {
                return NotFound();
            }      
            return NoContent();
        }
    }
}
