using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using iSmart.Entity.DTOs.ExportOrderDetailDTO;
using iSmart.Entity.DTOs.ImportOrderDetailDTO;
using iSmart.Entity.Models;
using iSmart.Service;

namespace iSmart.API.Controllers
{
    [Route("api/export-order-detail")]
    [ApiController]
    //[Authorize]

    public class ExportOrderDetailController : ControllerBase
    {
        private readonly IExportOrderDetailService _orderDetailService;

        public ExportOrderDetailController(IExportOrderDetailService orderDetailService)
        {
            _orderDetailService = orderDetailService;
        }

        [HttpGet("get-all-export-details")]
        public IActionResult GetAllOrderDetails()
        {
            var order = _orderDetailService.GetAllExportOrderDetails();
            if (order == null)
            {
                return NotFound("Don't have order detail");
            }
            return Ok(order);

        }

        [HttpGet("get-export-order-details")]
        public IActionResult GetOrderDetailsByOrderID(int oid)
        {
            var order = _orderDetailService.GetOrderDetailsByOrderID(oid);
            if (order == null)
            {
                return NotFound("Don't have order detail");
            }
            return Ok(order);
        }
        [HttpPost("add-export-order-detail")]
        public IActionResult AddOrderDetail([FromBody] CreateExportOrderDetailRequest detail)
        {
            var result = _orderDetailService.AddOrderDetail(detail);
            if (result == null)
            {
                return StatusCode(500);
            }
            return Ok(result);
        }

        [HttpPut("update-export-order-detail")]
        public IActionResult UpdateOrderDetail(UpdateExportOrderDetailRequest detail)
        {
            var result = _orderDetailService.UpdateOrderDetail(detail);
            if (result == null)
            {
                return StatusCode(500);
            }
            return Ok(result);
        }

        [HttpDelete("delete-export-order-detail/{id}")]
        public IActionResult DeleteOrderDetail(int id)
        {
            var result = _orderDetailService.DeleteExportOrderDetail(id);
            if (result == false)
            {
                return StatusCode(500);
            }
            return Ok("Delete order detail complete");
        }
        
    }
}
