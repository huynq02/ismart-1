using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using iSmart.Entity.DTOs.DeliveryDTO;
using iSmart.Entity.Models;
using iSmart.Service;

namespace iSmart.API.Controllers
{
    [Route("api/delivery")]
    [ApiController]
    //[Authorize]

    public class DeliveryController : ControllerBase
    {
        private readonly IDeliveryService _deliveryService;
        public DeliveryController(IDeliveryService deliveryService)
        {
            _deliveryService = deliveryService;
        }
        [HttpGet("get-all-delivery")]
        public IActionResult GetAllDelivery()
        {
            var result = _deliveryService.GetAllDelivery();
            return Ok(result);
        }

        [HttpGet("get-all-active-delivery")]
        public IActionResult GetAllActiveDelivery()
        {
            var result = _deliveryService.GetAllActiveDelivery();
            return Ok(result);
        }

        [HttpGet("get-delivery-with-filter")]

        public IActionResult GetDeliveryByKeyword(int page, string? keyword = "")
        {
            var result = _deliveryService.GetDeliveryByKeyWord(page, keyword);
            return Ok(result);
        }

        [HttpGet("get-delivery")]      
        public IActionResult GetDeliveryById(int id)
        {
            var result = _deliveryService.GetDeliveryById(id);
            if (result == null)
            {
                return NotFound("Khong co ket qua");

            }
            else
                return Ok(result);
        }
        [HttpPost("add-delivery")]
        public async Task<IActionResult> AddDelivery(CreateDeliveryRequest delivery)
        {
            var result = _deliveryService.AddDelivery(delivery);
            return Ok(result);
        }

        [HttpPut("update-delivery")]
        public async Task<IActionResult> UpdateDelivery(UpdateDeliveryRequest delivery)
        {
            var result = _deliveryService.UpdateDelivery(delivery);
            return Ok(result);
        }

        [HttpPut("update-delivery-status")]
        public async Task<IActionResult> UpdateStatus(int id)
        {
            var result = _deliveryService.UpdateDeleteStatusDelivery(id);
            return Ok(result);
        }
    }
}
