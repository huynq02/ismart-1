using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using iSmart.Entity.DTOs.ReturnOrderDTO;
using iSmart.Service;
using iSmart.Entity.Models;
using Microsoft.EntityFrameworkCore;

namespace iSmart.API.Controllers
{
    [Route("api/return-order")]
    [ApiController]
    public class ReturnOrderController : ControllerBase
    {
        private readonly IReturnOrderService _returnOrderService;
        private readonly iSmartContext _context;

        public ReturnOrderController(IReturnOrderService returnOrderService, iSmartContext context)
        {
            _returnOrderService = returnOrderService;
            _context = context;
        }
        [HttpGet("get-export-order-by-id/{id}")]
        public IActionResult GetImportOrderById(int id)
        {
            var result = _returnOrderService.GetReturnOrderById(id);
            if (result == null)
            {
                return NotFound(new { message = "Import order not found." });
            }
            return Ok(result);
        }
        [HttpPost("create-return-order")]
        public ActionResult<CreateReturnOrderResponse> CreateReturnOrder(CreateReturnOrderRequest request, int staffId)
        {
            var response = _returnOrderService.CreateReturnOrder(request, staffId);
            if (response.IsSuccess)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpGet("get-all-return-orders")]
        public ActionResult<List<ReturnOrderDTO>> GetAllReturnOrders()
        {
            var returnOrders = _returnOrderService.GetAllReturnOrders();
            return Ok(returnOrders);
        }

        [HttpGet("get-return-order-newest")]
        public ActionResult<int> GetReturnOrderNewest()
        {
            var returnOrderId = _returnOrderService.GetReturnOrderNewest();
            return Ok(returnOrderId);
        }

        [HttpGet("return-order-filter-paging")]
        public ActionResult<ReturnOrderFilterPaging> ReturnOrderFilterPaging(int pageSize, int page, int? warehouseId, int? userId, int? approvedById, int? status, int? sortDate, string? keyword = "")
        {
            var result = _returnOrderService.ReturnOrderFilterPaging(pageSize, page, warehouseId, userId, approvedById, status, sortDate, keyword);
            return Ok(result);
        }

        [HttpPost("update-order")]
        public ActionResult<UpdateReturnOrderResponse> UpdateOrder(UpdateReturnOrderRequest request)
        {
            var response = _returnOrderService.UpdateOrder(request);
            if (response.IsSuccess)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpPost("confirm-return")]
        public async Task<IActionResult> ConfirmReturnOrder(int returnOrderId)
        {
            try
            {
                var result = await _context.ReturnsOrders
                                           .Include(r => r.ReturnsOrderDetails)
                                           .ThenInclude(d => d.Goods)
                                           .FirstOrDefaultAsync(r => r.ReturnOrderId == returnOrderId);

                if (result != null && result.StatusId == 3)
                {
                    result.StatusId = 4;
                    result.ConfirmedDate = DateTime.Now;

                    foreach (var detail in result.ReturnsOrderDetails)
                    {
                        var product = detail.Goods;

                        var goodWarehouse = await _context.GoodsWarehouses
                                                          .FirstOrDefaultAsync(p => p.GoodsId == product.GoodsId && p.WarehouseId == result.WarehouseId);

                        if (goodWarehouse == null)
                        {
                            return BadRequest("Sản phẩm không tồn tại trong kho.");
                        }

                        int total = (int)detail.Quantity;

                        if (total > goodWarehouse.Quantity)
                        {
                            return BadRequest("Số lượng trả lại lớn hơn tồn kho.");
                        }

                        goodWarehouse.Quantity -= total;

                        var importDetail = await _context.ImportOrderDetails
                                                         .FirstOrDefaultAsync(i => i.BatchCode == detail.BatchCode);

                        if (importDetail == null)
                        {
                            return BadRequest("Chi tiết nhập hàng không tồn tại.");
                        }
                        importDetail.Quantity -= total;
                        importDetail.ActualQuantity -= total;
                    }

                    await _context.SaveChangesAsync();
                    return Ok("Đơn hàng trả lại đã được xác nhận thành công.");
                }
                else
                {
                    return BadRequest("Không có dữ liệu hoặc đơn hàng không ở trạng thái chờ xác nhận.");
                }
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi hệ thống: {ex.InnerException?.Message ?? ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi hệ thống: {ex.Message}");
            }
        }
    }
}