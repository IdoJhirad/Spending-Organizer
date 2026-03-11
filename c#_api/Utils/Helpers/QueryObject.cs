namespace c__api.Utils.Helpers
{
    //represent an query with properties that help filter by category dates and types
    public class QueryObject
    {
     
        //Change in here need to be change in the get all repo
        public int? CategoryId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public decimal? MinAmount { get; set; }
        public decimal? MaxAmount { get; set; }
        public string? SortBy { get; set; } = null;
        public bool IsDecsending { get; set; } = false;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
