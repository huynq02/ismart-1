//using iSmart.Entity.DTOs.ImportOrderDTO;
//using iSmart.Entity.Models;
//using iSmart.Service;
//using Microsoft.Extensions.Configuration;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Reflection.Metadata;
//using System.Text;
//using System.Threading.Tasks;
//using static System.Net.Mime.MediaTypeNames;

//namespace iSmart.Test
//{
//    internal class TestImportOrder
//    {
//        private ImportOrderService importOrderService { get; set; } = null;
//        private iSmartContext _context;
//        public IConfiguration _configuration;


//        [SetUp]
//        public void Setup()
//        {
//            var context = new iSmartContext();
//            _context = context;
//            importOrderService = new ImportOrderService(context);
//        }

//        [Test]
//        public void GetAllImportOrder_Test()
//        {
//            var result = false;
//            var importOrders = importOrderService.GetAllImportOrder();
//            if (importOrders != null) result = true;
//            Assert.That(result, Is.EqualTo(true));
//        }

//        [Test]
//        public void GetImportOrderNewest_Test()
//        {
//            var result = false;
//            var importOrders = importOrderService.GetAllImportOrder();
//            if (importOrders != null) result = true;
//            Assert.That(result, Is.EqualTo(true));
//        }

//        [Test]
//        public void ImportOrderFilterPaging_Test()
//        {
//            var result = false;
//            var importOrders = importOrderService.ImportOrderFilterPaging(1, 1, 1, 1, "1");
//            if (importOrders != null) result = true;
//            Assert.That(result, Is.EqualTo(true));
//        }

//        [Test]
//        public void CreateImportOrder_Test()
//        {
//            var result = false;
//            var importOrderEntry = new CreateImportOrderRequest
//            {
//                ImportCode = "test",
//                UserId = 1,
//                SupplierId = 1,
//                Note = "test",
//                CreatedDate = DateTime.Now,
//                ImportedDate = DateTime.Now,
//                StatusId = 1,
//                WarehouseId = 1,
//                DeliveryId = 1,
//                Image = "test",
//                StokekeeperId = 1
//            };
//            var importOrders = importOrderService.CreateImportOrder(importOrderEntry);
//            if (importOrders != null) result = true;
//            Assert.That(result, Is.EqualTo(true));
//        }

//        [Test]
//        public void GetImportOrderByOrderCode_Test()
//        {
//            var result = false;
//            var importOrders = importOrderService.GetImportOrderByOrderCode("IMP20240530001");
//            if (importOrders != null) result = true;
//            Assert.That(result, Is.EqualTo(true));
//        }

//        [Test]
//        public void UpdateOrder_Test()
//        {
//            var result = false;
//            var importOrderEntry = new UpdateImportOrderRequest
//            {
//                ImportId = 1,
//                ImportCode = "test",
//                UserId = 1,
//                SupplierId = 1,
//                TotalCost = 1,
//                Note = "test",
//                CreatedDate = DateTime.Now,
//                ImportedDate = DateTime.Now,
//                StatusId = 1,
//                StorageId = 1,
//                DeliveryId = 1,
//                Image = "test",
//                StokekeeperId = 1
//            };
//            var importOrders = importOrderService.UpdateOrder(importOrderEntry);
//            if (importOrders != null) result = true;
//            Assert.That(result, Is.EqualTo(true));
//        }

//        [Test]
//        public void Import_Test()
//        {
//            var result = false;
//            var importOrders = importOrderService.Import(1);
//            if (importOrders != null) result = true;
//            Assert.That(result, Is.EqualTo(true));
//        }
//    }
//}