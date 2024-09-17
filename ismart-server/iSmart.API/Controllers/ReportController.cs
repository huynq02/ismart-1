using iSmart.Entity.DTOs.GoodsDTO;
using iSmart.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks; // Thêm vào để sử dụng Task

namespace iSmart.API.Controllers
{
    [Route("api/report")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly OpenAIService _openAIService;
        private readonly IGoodsService _goodsService; // Sửa tên biến này thành _goodsService

        public ReportController(OpenAIService openAIService, IGoodsService goodsService)
        {
            _openAIService = openAIService;
            _goodsService = goodsService; // Sửa tên biến này thành _goodsService
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateReport([FromQuery] int warehouseId)
        {
            var goodsInWarehouse = await _goodsService.GetGoodsInWarehouse(warehouseId);
            var prompt = GenerateReportPrompt(goodsInWarehouse);
            var report = await _openAIService.GenerateReport(prompt);

            return Ok(new { Report = report });
        }

        private string GenerateReportPrompt(List<GoodsDTO> goods)
        {
            var prompt = "Create a detailed inventory report with the following data:\n";
            foreach (var item in goods)
            {
                prompt += $"Name: {item.GoodsName}, Code: {item.GoodsCode}, Category: {item.CategoryName}, Quantity: {item.InStock}, Stock Price: {item.StockPrice}, Measured Unit: {item.MeasuredUnit}, Description: {item.Description}, Created Date: {item.CreatedDate}, Warranty Time: {item.WarrantyTime}, Barcode: {item.Barcode}, Min Stock: {item.MinStock}, Max Stock: {item.MaxStock}, Supplier: {item.SupplierName}, Status: {item.Status}\n";
            }
            return prompt;
        }
    }
}
