using iSmart.Entity.DTOs.WarehouseDTO;
using iSmart.Entity.Models;
using iSmart.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Test
{
    internal class TestWarehouse
    {
        private WarehouseService warehouseService { get; set; } = null;
        private iSmartContext _context;

        [SetUp]
        public void Setup()
        {
            var context = new iSmartContext();
            _context = context;
            warehouseService = new WarehouseService(context);
        }

        [Test]
        public void GetAllStorage()
        {
            var result = false;
            var storageResponse = warehouseService.GetAllStorage();
            if (storageResponse != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void GetStoragesByKeyword()
        {
            var result = false;
            var storageResponse = warehouseService.GetStoragesByKeyword(1, "1");
            if (storageResponse != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void AddStorage()
        {
            var result = false;
            var storageEntry = new CreateWarehouseRequest
            {
                StorageName = "test",
                StorageAddress = "test",
                StoragePhone = "test"
            };
            var storageResponse = warehouseService.AddStorage(storageEntry);
            if (storageResponse != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void UpdateStorage()
        {
            var result = false;
            var storageEntry = new UpdateWarehouseRequest
            {
                StorageId = 1,
                StorageName = "test",
                StorageAddress = "test",
                StoragePhone = "test"
            };
            var storageResponse = warehouseService.UpdateStorage(storageEntry);
            if (storageResponse != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }
    }
}