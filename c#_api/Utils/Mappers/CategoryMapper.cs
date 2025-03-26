using c__api.Dtos.Categories;
using c__api.Models;

namespace c__api.Utils.Mappers
{
    public static class CategoryMapper
    {
        public static CategoryModel DtoToCategoryModel(this CreateCategoryDto dto)
        {
            return new CategoryModel
            {
                CategoryName = dto.CategoryName,
            };
        }
        public static CategoryDto CategoryModelToDto(this CategoryModel model)
        {
            return new CategoryDto
            {
                Id = model.Id,
                CategoryName = model.CategoryName,
                IsDefault = model.IsDefault,
            };
        }

    }
}
