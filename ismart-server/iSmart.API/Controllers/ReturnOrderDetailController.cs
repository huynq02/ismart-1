using iSmart.Entity.DTOs.ExportOrderDetailDTO;
using iSmart.Entity.DTOs.ReturnOrderDetailDTO;
using iSmart.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iSmart.API.Controllers
{
    [Route("api/return-order-detail")]
    [ApiController]
    //[Authorize]

    public class ReturnOrderDetailController : ControllerBase
    {
        private readonly IReturnOrderDetailService _orderDetailService;

        public ReturnOrderDetailController(IReturnOrderDetailService orderDetailService)
        {
            _orderDetailService = orderDetailService;
        }

        [HttpGet("get-all-return-order-details")]
        public IActionResult GetAllOrderDetails()
        {
            var order = _orderDetailService.GetAllReturnOrderDetails();
            if (order == null)
            {
                return NotFound("Don't have order detail");
            }
            return Ok(order);

        }

        [HttpGet("get-return-order-details")]
        public IActionResult GetOrderDetailsByOrderID(int oid)
        {
            var order = _orderDetailService.GetOrderDetailsByOrderID(oid);
            if (order == null)
            {
                return NotFound("Don't have order detail");
            }
            return Ok(order);
        }
        [HttpPost("add-return-order-detail")]
        public IActionResult AddOrderDetail(CreateReturnOrderDetailRequest detail)
        {
            var result = _orderDetailService.AddOrderDetail(detail);
            if (result == null)
            {
                return StatusCode(500);
            }
            return Ok(result);
        }

        [HttpPut("update-return-order-detail")]
        public IActionResult UpdateOrderDetail(UpdateReturnOrderDetailRequest detail)
        {
            var result = _orderDetailService.UpdateOrderDetail(detail);
            if (result == null)
            {
                return StatusCode(500);
            }
            return Ok(result);
        }

        [HttpDelete("delete-return-order-detail/{id}")]
        public IActionResult DeleteOrderDetail(int id)
        {
            var result = _orderDetailService.DeleteReturnOrderDetail(id);
            if (result == false)
            {
                return StatusCode(500);
            }
            return Ok("Delete order detail complete");
        }
    }
}
