using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.DTOs.CategoryDTO;
using iSmart.Entity.Models;
using iSmart.Service;

namespace iSmart.Test
{
    public class TestCategory
    {
        private CategoryService _categoryService { get; set; } = null;
        private iSmartContext _context;

        [SetUp]
        public void Setup()
        {
            var context = new iSmartContext();
            _context = context;
            _categoryService = new CategoryService(context);
        }
        // get all category
        [Test]
        public void GetAllCategory_Test()
        {
            var result = false;
            var categories = _categoryService.GetAllCategory();
            if (categories != null) result = true;
            Assert.That(result, Is.EqualTo(true));

        }
        //get category by keyword
        [Test]
        public void GetCategoryWithFilter_Test()
        {
            var result = false;
            var categories = _categoryService.GetCategoryByKeyword(1, "t");
            if (categories.Data.Count > 0) result = true;
            Assert.That(result, Is.EqualTo(true));
        }
        //get category by id
        [Test]
        public void GetCategoryById_Test()
        {
            var result = false;
            var categories = _categoryService.GetCategoryById(1);
            if (categories != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }
        //create new category
        [Test]
        public void CreateCategory_Test()
        {
            var result = false;
            var categoryEntry = new CreateCategoryRequest
            {
                CategoryName = "Test3",
                Description = "Test3",
            };
            var categoryResponse = _categoryService.AddCategory(categoryEntry);
            if (categoryResponse.IsSuccess == true) result = true;
            Assert.That(result, Is.EqualTo(true));
        }
        //update category
        [Test]
        public void EditCategory_Test()
        {
            var result = false;
            var categoryEntry = new UpdateCategoryRequest
            {
                CategoryId = 11,
                CategoryName = "TestUpdate",
                Description = "TestUpdate"
            };
            var categoryResponse = _categoryService.UpdateCategory(categoryEntry);
            if (categoryResponse.IsSuccess is true) result = true;
            Assert.That(result, Is.EqualTo(true));
        }
    }
}