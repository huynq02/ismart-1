using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using iSmart.Entity.DTOs.CategoryDTO;
using iSmart.Service;

namespace iSmart.API.Controllers
{
    [Route("api/category")]
    [ApiController]
    //[Authorize]

    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        // GET: CategoryController
        [HttpGet("get-all-category")]
        public async Task<IActionResult> GetAllCategory()
        {
            var result = await _categoryService.GetAllCategory();

            return Ok(result);
        }

        [HttpGet("get-category")]
        // GET: CategoryController/Details/5
        public IActionResult GetCategoryByKeyword(int page, string? keyword = "")
        {
            var result = _categoryService.GetCategoryByKeyword(page, keyword);
            return Ok(result);
        }
        [HttpPost("add-category")]
        public async Task<IActionResult> AddCategory(CreateCategoryRequest category)
        {
            var result = _categoryService.AddCategory(category);
            return Ok(result);
        }

        [HttpPut("update-category")]
        public async Task<IActionResult> UpdateCategory(UpdateCategoryRequest goods)
        {
            var result = _categoryService.UpdateCategory(goods);
            return Ok(result);
        }
    }
}