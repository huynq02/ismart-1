using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.EntityFrameworkCore;
using iSmart.Entity.DTOs.ExportOrderDTO;
using iSmart.Entity.DTOs.UserDTO;
using iSmart.Entity.Models;
using iSmart.Service;

namespace iSmart.API.Controllers
{
    [Route("api/export-order")]
    [ApiController]
    //[Authorize]

    public class ExportOrderController : ControllerBase
    {
        public IConfiguration _configuration;
        private readonly IExportOrderService _exportService;
        private readonly iSmartContext _context;

        public ExportOrderController(IExportOrderService exportOrderService, IConfiguration configuration, iSmartContext context)
        {
            _exportService = exportOrderService;
            _configuration = configuration;
            _context = context;
        }
        [HttpGet("get-export-order-by-id/{id}")]
        public IActionResult GetImportOrderById(int id)
        {
            var result = _exportService.GetExportOrderById(id);
            if (result == null)
            {
                return NotFound(new { message = "Import order not found." });
            }
            return Ok(result);
        }
        [HttpPost("add-export-order")]
        public IActionResult AddExportOrder(bool isInternalTransfer, CreateExportOrderRequest i, int staffId)
        {
            var result = _exportService.CreateExportOrder(isInternalTransfer, i, staffId);
            return Ok(result);
        }

        [HttpGet("get-all-export-orders")]

        public IActionResult GetAllOrders()
        {
            var result = _exportService.GetAllExportOrder();
            return Ok(result);
        }

        [HttpGet("get-newest-export-order")]

        public IActionResult GetNewestImportOrder()
        {
            var result = _exportService.GetExportOrderNewest();
            return Ok(result);
        }

        [HttpGet("get-export-orders")]
        public IActionResult GetOrdersByKeyword(int pageSize, int page, int? warehouseId, int? userId, int? managerId, int? status, int? sortDate, string? keyword = "")
        {
            var reult = _exportService.ExportOrderFilterPaging(pageSize, page, warehouseId, userId, managerId, status, sortDate, keyword);
            return Ok(reult);
        }

        [HttpPost("cancel-export")]
        public async Task<IActionResult> Cancelexport(int exportId)
        {
            var result = _context.ExportOrders.FirstOrDefault(i => i.ExportId == exportId);
            if (result != null && result.StatusId == 3)
            {
                result.StatusId = 5;
                result.ExportedDate = DateTime.Now;
                _context.ExportOrders.Update(result);
                await _context.SaveChangesAsync();
                return Ok("thành công");
            }
            else return BadRequest("Không tồn tại");

        }

        [HttpPut("update-export-order")]
        public IActionResult UpdateExportOrder(UpdateExportOrderRequest i)
        {
            var result = _exportService.UpdateOrder(i);
            return Ok(result);
        }

        [HttpPost("export")]
        public async Task<IActionResult> Export(int exportId)
        {
            try
            {
                var result = await _context.ExportOrders
                                           .Include(a => a.ExportOrderDetails)
                                           .ThenInclude(d => d.Goods)
                                           .SingleOrDefaultAsync(x => x.ExportId == exportId);

                if (result != null && result.StatusId == 3)
                {
                    result.StatusId = 4;
                    result.ExportedDate = DateTime.Now;

                    foreach (var detail in result.ExportOrderDetails)
                    {
                        var product = detail.Goods;

                        if (product == null)
                        {
                            return BadRequest("Hàng hóa không tồn tại.");
                        }

                        var goodWarehouse = _context.GoodsWarehouses.FirstOrDefault(p => p.GoodsId == product.GoodsId && p.WarehouseId == result.WarehouseId);
                        if (goodWarehouse == null)
                        {
                            return BadRequest("Hàng không tồn tại trong kho.");
                        }

                        int total = (int)detail.Quantity;
                        if (total > goodWarehouse.Quantity)
                        {
                            return BadRequest("Số lượng xuất lớn hơn tồn kho");
                        }
                        _context.ImportOrderDetails.FirstOrDefault(i => i.DetailId == detail.ImportOrderDetailId).ActualQuantity -= total;
                        _context.SaveChanges();
                        goodWarehouse.Quantity -= total;


                        var history = new GoodsHistory
                        {
                            GoodsId = product.GoodsId,
                            ActionId = 2,
                            QuantityDifferential = $"-{total}",
                            CostPrice = product.StockPrice,
                            Quantity = goodWarehouse.Quantity,
                            OrderCode = result.ExportCode,
                            UserId = (int)result.UserId,
                            Date = DateTime.Now
                        };

                        var pricedifferential = product.StockPrice - history.CostPrice;
                        history.CostPriceDifferential = pricedifferential > 0 ? $"+{pricedifferential}" : pricedifferential < 0 ? $"-{pricedifferential}" : null;

                        _context.Add(history);
                    }

                    await _context.SaveChangesAsync();
                    return Ok("Thành công");
                }
                else
                {
                    return BadRequest("Không có dữ liệu");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Đã xảy ra lỗi hệ thống.");
            }
        }


    }
}