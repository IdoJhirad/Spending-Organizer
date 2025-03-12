using System.Text.Json;
using c__api.Data;
using c__api.Models;

namespace c__api.Utils.Services
{
    public static class SeedCategories
    {
        
        public static async Task InitializeCategory(ApplicationDBContext context, IConfiguration configuration, ILogger logger)
        {
            logger.LogInformation("start category seeding.");
            if (context.Categories.Any())
            {
                logger.LogInformation("Categories already exist. Skipping seeding.");
                return;
            }
            try
            {
                var filePath = configuration["SeedData:CategoryFilePath"];
                if (filePath == null || !File.Exists(filePath))
                {
                    logger.LogError($"The categories file was not found at path: {filePath}");
                    return;
                }
                // Read and deserialize JSON file ass array of strings
                var json = await File.ReadAllTextAsync(filePath);
                var categoryNames = JsonSerializer.Deserialize<List<string>>(json);

                if (categoryNames == null || categoryNames.Count == 0)
                {
                    logger.LogWarning("No categories found in the seed file.");
                    return;
                }
                // Convert each string to a CategoryModel
                var categories = categoryNames.Select(name => new CategoryModel
                {
                    CategoryName = name,
                    IsDefault = true,
                }).ToList();

                await context.Categories.AddRangeAsync(categories);
                await context.SaveChangesAsync();

                logger.LogInformation("Categories seeded successfully.");

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding categories.");
            }
        }
    }
}
