using c__api.Dtos.Categories;
using c__api.Models;

namespace c__api.Utils.Mappers
{
    public static class CategoryMapper
    {
        public static CategoryModel DtoToCategoryModel(this CreateCategoryDto dto ,string appUserID)
        {
            return new CategoryModel
            {
                CategoryName = dto.CategoryName,
                Icon = dto.Icon,
                AppUserId = appUserID,
            };
        }
        public static CategoryDto? CategoryModelToDto(this CategoryModel model)
        {
            if(model == null) return null;

            return new CategoryDto
            {
                Id = model.Id,
                CategoryName = model.CategoryName,
                Icon = model.Icon,
            };
        }

    }
}
