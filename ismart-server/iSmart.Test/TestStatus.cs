using iSmart.Entity.Models;
using iSmart.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Test
{
    internal class TestStatus
    {
        private StatusService statusService { get; set; } = null;
        private iSmartContext _context;

        [SetUp]
        public void Setup()
        {
            var context = new iSmartContext();
            _context = context;
            statusService = new StatusService(context);
        }

        [Test]
        public void GetAllStatus_Test()
        {
            var result = false;
            var statusRespone = statusService.GetAllStatus();
            if (statusRespone != null) result = true;
            Assert.That(result, Is.EqualTo(true));
        }
    }
}