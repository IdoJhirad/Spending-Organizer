namespace c__api.Dtos.Categories
{
    public class BudgetStatusDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public decimal? BudgetLimit { get; set; }
        public decimal Spent { get; set; }
        public decimal? Remaining => BudgetLimit.HasValue ? BudgetLimit.Value - Spent : null;
        public bool IsOverBudget => BudgetLimit.HasValue && Spent > BudgetLimit.Value;
        public bool IsNearLimit => BudgetLimit.HasValue && Spent >= BudgetLimit.Value * 0.8m && !IsOverBudget;
    }
}
