using iSmart.Entity.DTOs.SupplierDTO;
using iSmart.Entity.Models;
using iSmart.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Test
{
    internal class TestSupplier
    {
        private SupplierService supplierService { get; set; } = null;
        private iSmartContext _context;

        [SetUp]
        public void Setup()
        {
            var context = new iSmartContext();
            _context = context;
            supplierService = new SupplierService(context);
        }
        // get all category
        [Test]
        public void GetAllSupplier_Test()
        {
            var result = false;
            var suppliers = supplierService.GetAllSupplier();
            if (suppliers != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }
        //[Test]
        //public void AddSupplier_Test()
        //{
        //    var result = false;
        //    var supplierEntry = new CreateSupplierRequest
        //    {
        //        SupplierName = "Test",
        //        SupplierPhone = "Test",
        //        StatusId = 1,
        //        SupplierEmail = "Test",
        //        Note = "Test",
        //    };
        //    var supplierResponse = supplierService.AddSupplier(supplierEntry);
        //    if (supplierResponse.IsSuccess == true) result = true;
        //    Assert.That(result, Is.EqualTo(true));
        //}

        [Test]
        public void GetAllActiveSupplier_Test()
        {
            var result = false;
            var suppliers = supplierService.GetAllActiveSupplier();
            if (suppliers != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void GetSupplierById_Test()
        {
            var result = false;
            var suppliers = supplierService.GetSupplierById(2);
            if (suppliers != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void GetSupplierByKeyword_Test()
        {
            var result = false;
            var suppliers = supplierService.GetSupplierByKeyword(1, 1, "1");
            if (suppliers != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void UpdateDeleteStatusSupplier_Test()
        {
            var result = false;
            var suppliers = supplierService.UpdateDeleteStatusSupplier(2);
            if (suppliers != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void UpdateSupplier_Test()
        {
            var result = false;
            var supplierEntry = new UpdateSupplierRequest
            {
                SupplierId = 2,
                SupplierName = "Test",
                SupplierPhone = "Test",
                StatusId = 1,
                SupplierEmail = "Test",
                Note = "Test",
            };
            var supplierResponse = supplierService.UpdateSupplier(supplierEntry);
            if (supplierResponse.IsSuccess == true) result = true;
            Assert.That(result, Is.EqualTo(true));
        }
    }
}