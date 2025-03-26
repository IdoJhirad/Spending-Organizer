namespace c__api.Dtos.Categories
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Icon { get; set; }
        public string IconName
        {
            get
            {
                return string.IsNullOrEmpty(Icon) ? CategoryName : Icon + " " + CategoryName;
            }
        }
    }
}
