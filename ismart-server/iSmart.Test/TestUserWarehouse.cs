using iSmart.Entity.Models;
using iSmart.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Test
{
    internal class TestUserWarehouse
    {
        private UserWarehouseService userWarehouseService { get; set; } = null;
        private iSmartContext _context;

        [SetUp]
        public void Setup()
        {
            var context = new iSmartContext();
            _context = context;
            userWarehouseService = new UserWarehouseService(context);
        }

        [Test]
        public void GetWarehouseIdByIdAsync_Test()
        {
            var result = false;
            var userWarehouseResponse = userWarehouseService.GetWarehouseIdByIdAsync(1);
            if (userWarehouseResponse != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void AddUserToWarehouseAsync_Test()
        {
            var result = false;
            var userWarehouseResponse = userWarehouseService.AddUserToWarehouseAsync(1, 1);
            if (userWarehouseResponse != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void GetUserWarehousesAsync_Test()
        {
            var result = false;
            var userWarehouseResponse = userWarehouseService.GetUserWarehousesAsync(1);
            if (userWarehouseResponse != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void RemoveUserFromWarehouseAsync_Test()
        {
            var result = false;
            var userWarehouseResponse = userWarehouseService.RemoveUserFromWarehouseAsync(1, 1);
            if (userWarehouseResponse != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }
    }
}