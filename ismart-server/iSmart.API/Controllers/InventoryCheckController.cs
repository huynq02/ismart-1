using iSmart.Entity.DTOs.InventoryCheckDTO;
using iSmart.Entity.DTOs.ReturnOrderDTO;
using iSmart.Entity.Models;
using iSmart.Service;
using iText.IO.Font;
using iText.IO.Font.Constants;
using iText.Kernel.Font;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace iSmart.API.Controllers
{
    [Route("api/inventory-check")]
    [ApiController]
    public class InventoryCheckController : ControllerBase
    {
        private readonly IInventoryCheckService _inventoryCheckService;
        private readonly iSmartContext _context;

        public InventoryCheckController(IInventoryCheckService inventoryCheckService, iSmartContext context)
        {
            _inventoryCheckService = inventoryCheckService;
            _context = context;
        }

        [HttpPost("create-return-order")]
        public ActionResult<InventoryCheck> CreateInventoryCheckAsync(CreateInventoryCheckDTO inventoryCheck)
        {
            var result = _inventoryCheckService.CreateInventoryCheck(inventoryCheck);
            return Ok(result);

        }

        [HttpGet("get-all-inventory-checks")]
        public async Task<ActionResult<List<CreateInventoryCheckDTO>>> GetAllInventoryChecksAsync(int? warehouseId)
        {
            try
            {
                var inventoryChecks = await _inventoryCheckService.GetAllInventoryChecksAsync(warehouseId);
                return Ok(inventoryChecks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("get-inventory-check/{id}")]
        public async Task<ActionResult<ResponseInventoryCheckDTO>> GetInventoryCheckByIdAsync(int id)
        {
            try
            {
                var inventoryCheck = await _inventoryCheckService.GetInventoryCheckByIdAsync(id);
                if (inventoryCheck == null)
                {
                    return NotFound(new { Message = $"Inventory Check with ID {id} not found." });
                }
                return Ok(inventoryCheck);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost("cancel-inventory-check")]
        public async Task<IActionResult> CancelInventoryCheck(int id)
        {
            var result = _context.InventoryChecks.FirstOrDefault(i => i.Id == id);
            if (result != null && result.StatusId == 3)
            {
                result.StatusId = 5;
                result.CheckDate = DateTime.Now;
                _context.InventoryChecks.Update(result);
                await _context.SaveChangesAsync();
                return Ok("thành công");
            }
            else return BadRequest("Không tồn tại");

        }

        [HttpPost("update-batch-quantities")]
        public async Task<ActionResult> UpdateBatchQuantitiesAsync([FromBody] Dictionary<string, int> batchQuantities, int id)
        {
            var result = _context.InventoryChecks.FirstOrDefault(i => i.Id == id);
            if (result != null && result.StatusId == 3)
            {
                result.StatusId = 4;
                result.CheckDate = DateTime.Now;
                _context.InventoryChecks.Update(result);
                await _context.SaveChangesAsync();

                try
                {
                    await _inventoryCheckService.UpdateBatchQuantitiesAsync(batchQuantities);
                    return Ok(new { Message = "Cập nhật số lượng batch thành công." });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { Message = $"Lỗi máy chủ nội bộ: {ex.Message}" });
                }
            }
            else
            {
                return BadRequest("Không tồn tại hoặc trạng thái không hợp lệ.");
            }
        }


        [HttpGet("export-inventory-check/{id}")]
        public async Task<IActionResult> ExportInventoryCheckToPdf(int id)
        {
            try
            {
                var inventoryCheck = await _inventoryCheckService.GetInventoryCheckByIdAsync(id);

                if (inventoryCheck == null)
                {
                    return NotFound($"Phiếu kiểm kê với ID {id} không tồn tại.");
                }

                using (var stream = new MemoryStream())
                {
                    // Create PdfWriter with the MemoryStream
                    using (var writer = new PdfWriter(stream))
                    {
                        using (var pdf = new PdfDocument(writer))
                        {
                            var document = new Document(pdf);

                            // Load and set font
                            var fontPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/fonts/arial.ttf");
                            var font = PdfFontFactory.CreateFont(fontPath, PdfEncodings.IDENTITY_H);

                            document.SetFont(font);

                            // Title (Center)
                            document.Add(new Paragraph("Báo Cáo Kiểm Kê Kho")
                                .SetFontSize(18)
                                .SetBold()
                                .SetTextAlignment(TextAlignment.CENTER));  // Căn giữa

                            // Warehouse Info (Left)
                            document.Add(new Paragraph($"Tên Kho: {inventoryCheck.WarehouseName}")
                                .SetTextAlignment(TextAlignment.LEFT));  // Căn trái
                            document.Add(new Paragraph($"Địa Chỉ Kho: {inventoryCheck.WarehouseAddress}")
                                .SetTextAlignment(TextAlignment.LEFT));  // Căn trái
                            document.Add(new Paragraph($"Tên Kế Toán: {inventoryCheck.AccountantName}")
                                .SetTextAlignment(TextAlignment.LEFT));  // Căn trái
                            document.Add(new Paragraph($"Tên Quản Lý Kho: {inventoryCheck.WarehouseManagerName}")
                                .SetTextAlignment(TextAlignment.LEFT));  // Căn trái
                            document.Add(new Paragraph($"Ngày Kiểm Kê: {inventoryCheck.CheckDate:dd/MM/yyyy}")
                                .SetTextAlignment(TextAlignment.LEFT));  // Căn trái
                            document.Add(new Paragraph("\n"));

                            var table = new iText.Layout.Element.Table(UnitValue.CreatePercentArray(new float[] { 1, 3, 4, 3, 3, 3, 2, 4 }))
                             .SetWidth(UnitValue.CreatePercentValue(100))
                             .SetFixedLayout();  // Thiết lập bảng ở chế độ bố cục cố định

                            // Add table headers with alignment
                            table.AddHeaderCell(new Cell().Add(new Paragraph("STT").SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                            table.AddHeaderCell(new Cell().Add(new Paragraph("Mã Hàng").SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                            table.AddHeaderCell(new Cell().Add(new Paragraph("Tên Hàng").SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                            table.AddHeaderCell(new Cell().Add(new Paragraph("Số Lượng Thực Tế").SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                            table.AddHeaderCell(new Cell().Add(new Paragraph("Số Lượng Trong App").SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                            table.AddHeaderCell(new Cell().Add(new Paragraph("Chênh Lệch").SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                            table.AddHeaderCell(new Cell().Add(new Paragraph("Đơn Vị Tính").SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                            table.AddHeaderCell(new Cell().Add(new Paragraph("Ghi Chú").SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE));

                            // Table Rows
                            int stt = 1;
                            foreach (var detail in inventoryCheck.Detail)
                            {
                                table.AddCell(new Cell().Add(new Paragraph(stt++.ToString()).SetTextAlignment(TextAlignment.CENTER)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                                table.AddCell(new Cell().Add(new Paragraph(detail.goodCode).SetTextAlignment(TextAlignment.LEFT)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                                table.AddCell(new Cell().Add(new Paragraph(detail.goodName).SetTextAlignment(TextAlignment.LEFT)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                                table.AddCell(new Cell().Add(new Paragraph(detail.ActualQuantity.ToString()).SetTextAlignment(TextAlignment.RIGHT)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                                table.AddCell(new Cell().Add(new Paragraph(detail.InAppQuantity.ToString()).SetTextAlignment(TextAlignment.RIGHT)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                                table.AddCell(new Cell().Add(new Paragraph(detail.Difference.ToString()).SetTextAlignment(TextAlignment.RIGHT)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                                table.AddCell(new Cell().Add(new Paragraph(detail.MeasureUnit).SetTextAlignment(TextAlignment.LEFT)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                                table.AddCell(new Cell().Add(new Paragraph(detail.Note).SetTextAlignment(TextAlignment.LEFT)).SetVerticalAlignment(VerticalAlignment.MIDDLE));
                            }



                            document.Add(table);

                            document.Close();
                        }
                    }

                    // Return the file as a response
                    return File(stream.ToArray(), "application/pdf", $"BaoCaoKiemKeKho_{id}.pdf");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Lỗi máy chủ: {ex.Message}" });
            }
        }

    }

}