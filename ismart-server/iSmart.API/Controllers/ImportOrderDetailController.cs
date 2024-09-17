using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using iSmart.Entity.DTOs.ImportOrderDetailDTO;
using iSmart.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace iSmart.API.Controllers
{
    [Route("api/import-order-detail")]
    [ApiController]
    //[Authorize]

    public class ImportOrderDetailController : ControllerBase
    {
        private readonly IImportOrderDetailService _orderDetailService;

        public ImportOrderDetailController(IImportOrderDetailService orderDetailService)
        {
            _orderDetailService = orderDetailService;
        }

        // GET: api/<ImportOrderDetailController>
        [HttpGet("get-all-import-details")]
        public IActionResult GetAllOrderDetails()
        {
            var order = _orderDetailService.GetAllOrderDetails();
            if (order == null)
            {
                return NotFound("Don't have order detail");
            }
            return Ok(order);

        }
        [HttpGet("get-batch-inventory-for-export-goods")]
        public IActionResult SelectBatchesForExport(int warehouseId, int goodId, int quantity, string method)
        {
            var order = _orderDetailService.SelectBatchesForExport(warehouseId, goodId, quantity, method);
            if (order == null)
            {
                return NotFound("Don't have batch in warehouse");
            }
            return Ok(order);
        }

        [HttpGet("get-available-batch")]
        public IActionResult GetAvailableBatch(int warehouseId, int goodId)
        {
            var order = _orderDetailService.GetBatchInventoryByGoodsId(warehouseId, goodId);
            if (order == null)
            {
                return NotFound("Don't have batch in warehouse");
            }
            return Ok(order);
        }
        [HttpGet("get-batch-by-batchcode")]
        public IActionResult GeBatchByBatchCode(string batchCode)
        {
            var order = _orderDetailService.GetBatchInventoryByBatchCode(batchCode);
            if (order == null)
            {
                return NotFound("Don't have batch in warehouse");
            }
            return Ok(order);
        }



        [HttpGet("get-batch-for-return")]
        public IActionResult GetBatchForReturn(int warehouseId, int goodId)
        {
            var order = _orderDetailService.GetBatchForReturn(warehouseId, goodId);
            if (order == null)
            {
                return NotFound("Don't have batch in warehouse");
            }
            return Ok(order);
        }

        [HttpPost("add-order-detail")]
        public IActionResult AddImportOrderDetail([FromBody] CreateImportOrderDetailRequest detail)
        {
            var result = _orderDetailService.AddOrderDetail(detail);
            if (result == null)
            {
                return StatusCode(500);
            }
            return Ok(result);
        }

        // DELETE api/<ImportOrderDetailController>/5
        [HttpDelete("delete-import-order-detail/{id}")]
        public IActionResult DeleteOrderDetail(int id)
        {
            var result = _orderDetailService.DeleteImportOrderDetail(id);
            if (result == false)
            {
                return StatusCode(500);
            }
            return Ok("Delete order detail complete");
        }

        // GET api/<ImportOrderDetailController>/5
        [HttpGet("get-import-order-details")]
        public IActionResult GetOrderDetailsByOrderID(int oid)
        {
            var order = _orderDetailService.GetOrderDetailsByOrderID(oid);
            if (order == null)
            {
                return NotFound("Don't have order detail");
            }
            return Ok(order);
        }


        // PUT api/<ImportOrderDetailController>/5
        [HttpPut("update-import-order-detail")]
        public IActionResult UpdateOrderDetail(UpdateImportOrderDetailRequest detail)
        {
            var result = _orderDetailService.UpdateOrderDetail(detail);
            if (result == null)
            {
                return StatusCode(500);
            }
            return Ok(result);
        }

    }
}