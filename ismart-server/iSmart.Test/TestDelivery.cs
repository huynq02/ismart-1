using iSmart.Entity.DTOs.DeliveryDTO;
using iSmart.Entity.Models;
using iSmart.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Test
{
    public class TestDelivery
    {
        private DeliveryService _deliveryService { get; set; } = null;
        private iSmartContext _context;

        [SetUp]
        public void Setup()
        {
            var context = new iSmartContext();
            _context = context;
            _deliveryService = new DeliveryService(context);
        }
        [Test]
        public void GetAllDelivery_Test()
        {
            var result = false;
            var deliveries = _deliveryService.GetAllDelivery();
            if (deliveries != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void UpdateDeleteStatusDelivery_Test()
        {
            var result = false;
            var deliveries = _deliveryService.UpdateDeleteStatusDelivery(2);
            if (deliveries != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void AddDelivery_Test()
        {
            var result = false;
            var deliveryEntry = new CreateDeliveryRequest
            {
                DeliveryName = "test"
            };
            var deliveries = _deliveryService.AddDelivery(deliveryEntry);
            if (deliveries != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void GetDeliveryById_Test()
        {
            var result = false;
            var deliveries = _deliveryService.GetDeliveryById(2);
            if (deliveries != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void GetDeliveryByKeyWord_Test()
        {
            var result = false;
            var deliveries = _deliveryService.GetDeliveryByKeyWord(2, "2");
            if (deliveries != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }

        [Test]
        public void UpdateDelivery_Test()
        {
            var result = false;
            var deliveryEntry = new UpdateDeliveryRequest
            {
                DeliveryId = 2,
                DeliveryName = "test",
            };
            var deliveries = _deliveryService.UpdateDelivery(deliveryEntry);
            if (deliveries != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }
    }
}