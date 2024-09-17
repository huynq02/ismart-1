using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.EntityFrameworkCore;
using iSmart.Entity.DTOs.ImportOrderDTO;
using iSmart.Entity.DTOs.UserDTO;
using iSmart.Entity.Models;
using iSmart.Service;

namespace iSmart.API.Controllers
{
    [Route("api/import-order")]
    [ApiController]
    //[Authorize]

    public class ImportOrderController : ControllerBase
    {
        public IConfiguration _configuration;
        private readonly IImportOrderService _importService;

        private readonly iSmartContext _context;

        public ImportOrderController(IImportOrderService ImportOrderService, iSmartContext context)
        {
            _importService = ImportOrderService;
            _context = context;
        }

        [HttpGet("get-all-import-orders")]
        public IActionResult GetAllOrders()
        {
            var result = _importService.GetAllImportOrder();
            return Ok(result);
        }

        [HttpGet("get-import-order-by-id/{id}")]
        public IActionResult GetImportOrderById(int id)
        {
            var result = _importService.GetImportOrderById(id);
            if (result == null)
            {
                return NotFound(new { message = "Import order not found." });
            }
            return Ok(result);
        }

        [HttpGet("get-newest-import-order")]
        public IActionResult GetNewestImportOrder()
        {
            var result = _importService.GetImportOrderNewest();
            return Ok(result);
        }

        [HttpGet("get-import-orders")]
        public IActionResult ImportOrderFilterPaging(int pageSize, int page, int? warehouseId, int? status, int? sortDate, string? keyword = "")
        {
            var reult = _importService.ImportOrderFilterPaging(pageSize, page, warehouseId, status, sortDate, keyword);
            return Ok(reult);
        }

        [HttpPost("add-import-order")]
        public IActionResult AddImportOrder(bool isInternalTransfer, CreateImportOrderRequest i, int staffId)
        {
            var result = _importService.CreateImportOrder(isInternalTransfer, i, staffId);
            return Ok(result);
        }


        [HttpPut("update-import-order")]
        public IActionResult UpdateImportOrder(UpdateImportOrderRequest i)
        {
            var result = _importService.UpdateOrder(i);
            return Ok(result);
        }

        [HttpPost("import/{importid}")]
        public async Task<IActionResult> Import(int importid)
        {
            var result = await _importService.Import(importid);
            if (result == "Thành công")
            {
                return Ok(result);
            }
            else if (result == "Không có dữ liệu")
            {
                return BadRequest(result);
            }
            else
            {
                return StatusCode(500, result);
            }
        }


        [HttpPost("cancel-import")]
        public async Task<IActionResult> CancelImport(int importId)
        {
            var result = _context.ImportOrders.FirstOrDefault(i => i.ImportId == importId);
            if (result != null && result.StatusId == 3)
            {
                result.StatusId = 5;
                result.ImportedDate = DateTime.Now;
                _context.ImportOrders.Update(result);
                await _context.SaveChangesAsync();
                return Ok("thành công");
            }
            else return BadRequest("Không tồn tại");

        }

    }
}