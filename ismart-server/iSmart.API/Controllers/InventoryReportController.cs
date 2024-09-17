using iSmart.Entity.DTOs.ReportDTO;
using iSmart.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace iSmart.API.Controllers
{
    [Route("api/inventory-report")]
    [ApiController]
    public class InventoryReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public InventoryReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("import")]
        public async Task<IActionResult> GetImportReport(DateTime? startDate, DateTime? endDate, int warehouseId)
        {
            try
            {
                var result = await _reportService.GetImportReport(startDate, endDate, warehouseId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet("import-filter-by-good-code")]
        public async Task<IActionResult> GetImportReport(DateTime? startDate, DateTime? endDate, int warehouseId, string goodCode)
        {
            try
            {
                var result = await _reportService.GetImportReportByGoodCode(startDate, endDate, warehouseId, goodCode);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet("export")]
        public async Task<IActionResult> GetExportReport(DateTime? startDate, DateTime? endDate, int warehouseId)
        {
            try
            {
                var result = await _reportService.GetExportReport(startDate, endDate, warehouseId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet("inventory")]
        public async Task<IActionResult> GetInventoryReport(DateTime? startDate, DateTime? endDate, int warehouseId)
        {
            try
            {
                var result = await _reportService.GetInventoryReport(startDate, endDate, warehouseId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet("inventory-by-month")]
        public async Task<IActionResult> GetInventoryReportByMonth(int warehouseId, string goodCode, int year)
        {
            try
            {
                var result = await _reportService.GetInventoryReportByMonth(warehouseId, goodCode, year);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }


    }
}