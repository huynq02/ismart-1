using iSmart.Entity.DTOs.ImportOrderDetailDTO;
using iSmart.Entity.Models;
using iSmart.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Test
{
    internal class TestImportOrderDetail
    {
        private ImportOrderDetailService importOrderDetailService { get; set; } = null;
        private iSmartContext _context;

        [SetUp]
        public void Setup()
        {
            var context = new iSmartContext();
            _context = context;
            importOrderDetailService = new ImportOrderDetailService(context);
        }
        [Test]
        public void GetAllOrderDetails_Test()
        {
            var result = false;
            var IMDetails = importOrderDetailService.GetAllOrderDetails();
            if (IMDetails != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void AddOrderDetail_Test()
        {
            var result = false;
            var requestOrder = new CreateImportOrderDetailRequest
            {
                ImportId = 2,
                GoodsId = 2,
                Quantity = 1000,
                CostPrice = 200,
                BatchCode = "Batch0012",
                ExpiryDate = DateTime.Now,
                ManufactureDate = DateTime.Now,
            };
            var IMDetails = importOrderDetailService.AddOrderDetail(requestOrder);
            if (IMDetails != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void DeleteImportOrderDetail_Test()
        {
            var result = false;
            var IMDetails = importOrderDetailService.DeleteImportOrderDetail(2);
            if (IMDetails != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void GetOrderDetailsByOrderID_Test()
        {
            var result = false;
            var IMDetails = importOrderDetailService.GetOrderDetailsByOrderID(2);
            if (IMDetails != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void UpdateOrderDetail()
        {
            var result = false;
            var requestOrder = new UpdateImportOrderDetailRequest
            {
                ImportId = 2,
                GoodsId = 2,
                Quantity = 1000,
                CostPrice = 200,
                BatchCode = "Batch0012",
                ExpiryDate = DateTime.Now,
                ManufactureDate = DateTime.Now,
            };
            var IMDetails = importOrderDetailService.UpdateOrderDetail(requestOrder);
            if (IMDetails != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }
    }
}