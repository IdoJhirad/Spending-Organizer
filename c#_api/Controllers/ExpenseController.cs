using c__api.Data;
using c__api.Dtos.Expense;
using c__api.Interfaces;
using c__api.Utils.Helpers;
using c__api.Utils.Mappers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace c__api.Controllers
{
    [Route("api/expense")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseRepository _expenseRepo;
        private readonly ICategoryRepository _categoryRepo;
        public ExpenseController(IExpenseRepository expenseRepository, ICategoryRepository categoryRepository)
        {
            _expenseRepo = expenseRepository;
            _categoryRepo = categoryRepository;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query)
        {
            //Todo Add filter by CAtegory by dates by type that i will do
            var expense = await _expenseRepo.GetAllExpensesAsync(query);
              
            var expenseDto = expense.Select(e => e.ExpenseToDto()).ToList();

            return Ok(expenseDto);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var expense = await _expenseRepo.GetExpenseByIdAsync(id);
            if(expense == null)
            {
                return NotFound("expense not found");
            }
            return Ok(expense.ExpenseToDto());
        }

        [HttpPost]
        public async Task<IActionResult> CreateExpense([FromBody] CreateExpenseDto expenseDto)
        {
            var categoryExists = await _categoryRepo.IsCategoryExists(expenseDto.CategoryId);

            if (!categoryExists)
            {
                expenseDto.CategoryId = 1;
            }

            var expense = expenseDto.DtoToExpense();

            await _expenseRepo.CreateAsync(expense);
            return CreatedAtAction(nameof(GetById), new { id = expense.Id }, expense.ExpenseToDto());
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateExpense([FromRoute] int id, [FromBody] UpdateExpenseDto expenseDto)
        {
            var categoryExists = await _categoryRepo.IsCategoryExists(expenseDto.CategoryId);

            if (!categoryExists)
            {
                expenseDto.CategoryId = 1;
            }

            var expense = await _expenseRepo.UpdateExpenseAsync(id, expenseDto);

            if( expense == null)
            {
                return NotFound();
            }
           
            return Ok(expense.ExpenseToDto());
        }
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteExpense([FromRoute] int id)
        {
            var expense = await _expenseRepo.DeleteAsync(id);
            if (expense == null)
            {
                return NotFound();
            }      
            return NoContent();
        }
    }
}
