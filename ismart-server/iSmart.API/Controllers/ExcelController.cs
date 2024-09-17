using iSmart.Entity.DTOs.GoodsDTO;
using iSmart.Entity.Models;
using iSmart.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace iSmart.API.Controllers
{
    [Route("api/excel")]
    [ApiController]
    public class ExcelController : ControllerBase
    {
        private static readonly string[] PermittedExtensions = { ".xlsx", ".xls" };
        private static readonly string[] ExcelMimeTypes = { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel" };
        private readonly string _uploadsFolderPath;
        private readonly IGoodsService _goodsService;

        private readonly iSmartContext _context;
        public ExcelController(IWebHostEnvironment env, IGoodsService goodsService, iSmartContext context)
        {
            _uploadsFolderPath = Path.Combine(env.WebRootPath, "uploads");
            _goodsService = goodsService;
            _context = context;
        }

        [HttpGet("download-template")]
        public IActionResult DownloadExcelTemplate()
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial; // Thiết lập LicenseContext

            var goodsCategories = _context.Categories.ToList();
            var suppliers = _context.Suppliers.ToList();

            using (var package = new ExcelPackage())
            {
                // Tạo sheet thông tin hàng hóa
                var worksheet = package.Workbook.Worksheets.Add("Mẫu Hàng Hóa");
                worksheet.Cells[1, 1].Value = "Mã Hàng Hóa";
                worksheet.Cells[1, 2].Value = "Tên Hàng Hóa";
                worksheet.Cells[1, 3].Value = "Mã Danh Mục";
                worksheet.Cells[1, 4].Value = "Mô Tả";
                worksheet.Cells[1, 5].Value = "Mã Nhà Cung Cấp";
                worksheet.Cells[1, 6].Value = "Đơn Vị Tính";
                worksheet.Cells[1, 7].Value = "Hình Ảnh";
                worksheet.Cells[1, 8].Value = "Thời Gian Bảo Hành";
                worksheet.Cells[1, 9].Value = "Tồn Tối Đa";
                worksheet.Cells[1, 10].Value = "Tồn Tối Thiểu";

                // Đặt kích thước cột
                worksheet.Column(1).Width = 15; // Mã Hàng Hóa
                worksheet.Column(2).Width = 20; // Tên Hàng Hóa
                worksheet.Column(3).Width = 15; // Mã Danh Mục
                worksheet.Column(4).Width = 30; // Mô Tả
                worksheet.Column(5).Width = 15; // Mã Nhà Cung Cấp
                worksheet.Column(6).Width = 10; // Đơn Vị Đo Lường
                worksheet.Column(7).Width = 30; // Hình Ảnh
                worksheet.Column(8).Width = 15; // Thời Gian Bảo Hành
                worksheet.Column(9).Width = 10; // Tồn Tối Đa
                worksheet.Column(10).Width = 10; // Tồn Tối Thiểu

                // Tạo sheet danh mục hàng hóa
                var categorySheet = package.Workbook.Worksheets.Add("Danh Mục Hàng Hóa");
                categorySheet.Cells[1, 1].Value = "Mã Danh Mục";
                categorySheet.Cells[1, 2].Value = "Tên Danh Mục";

                categorySheet.Column(1).Width = 15; // Mã Danh Mục
                categorySheet.Column(2).Width = 30; // Tên Danh Mục

                for (int i = 0; i < goodsCategories.Count; i++)
                {
                    categorySheet.Cells[i + 2, 1].Value = goodsCategories[i].CategoryId;
                    categorySheet.Cells[i + 2, 2].Value = goodsCategories[i].CategoryName;
                }

                // Tạo sheet nhà cung cấp
                var supplierSheet = package.Workbook.Worksheets.Add("Nhà Cung Cấp");
                supplierSheet.Cells[1, 1].Value = "Mã Nhà Cung Cấp";
                supplierSheet.Cells[1, 2].Value = "Tên Nhà Cung Cấp";

                supplierSheet.Column(1).Width = 15; // Mã Nhà Cung Cấp
                supplierSheet.Column(2).Width = 30; // Tên Nhà Cung Cấp

                for (int i = 0; i < suppliers.Count; i++)
                {
                    supplierSheet.Cells[i + 2, 1].Value = suppliers[i].SupplierId;
                    supplierSheet.Cells[i + 2, 2].Value = suppliers[i].SupplierName;
                }

                // Tạo sheet đơn vị đo lường
                var unitSheet = package.Workbook.Worksheets.Add("Đơn Vị Đo Lường");
                unitSheet.Cells[1, 1].Value = "Tên Đơn Vị";
                unitSheet.Cells[2, 1].Value = "Thùng";
                unitSheet.Cells[3, 1].Value = "Kg";

                unitSheet.Column(1).Width = 15; // Tên Đơn Vị
                unitSheet.Row(1).Height = 20; // Chiều cao hàng tiêu đề


                // Thiết lập các sheet này làm tài liệu tham khảo trong mẫu file Excel
                var categoryRange = $"Danh Mục Hàng Hóa'!$A$2:$A${goodsCategories.Count + 1}";
                var supplierRange = $"Nhà Cung Cấp'!$A$2:$A${suppliers.Count + 1}";
                var unitRange = $"Đơn Vị Đo Lường'!$A$2:$A$3";

                var categoryValidation = worksheet.DataValidations.AddListValidation("C2:C1000");
                categoryValidation.Formula.ExcelFormula = categoryRange;
                categoryValidation.ShowErrorMessage = true;
                categoryValidation.ErrorTitle = "Danh Mục Không Hợp Lệ";
                categoryValidation.Error = "Vui lòng chọn một danh mục hợp lệ từ danh sách.";

                var supplierValidation = worksheet.DataValidations.AddListValidation("E2:E1000");
                supplierValidation.Formula.ExcelFormula = supplierRange;
                supplierValidation.ShowErrorMessage = true;
                supplierValidation.ErrorTitle = "Nhà Cung Cấp Không Hợp Lệ";
                supplierValidation.Error = "Vui lòng chọn một nhà cung cấp hợp lệ từ danh sách.";

                var unitValidation = worksheet.DataValidations.AddListValidation("F2:F1000");
                unitValidation.Formula.ExcelFormula = unitRange;
                unitValidation.ShowErrorMessage = true;
                unitValidation.ErrorTitle = "Đơn Vị Tính Không Hợp Lệ";
                unitValidation.Error = "Vui lòng chọn một đơn vị tính hợp lệ từ danh sách.";

                var stream = new MemoryStream();
                package.SaveAs(stream);

                var content = stream.ToArray();
                return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "MauHangHoa.xlsx");
            }
        }



        [HttpPost("upload-excel/{warehouseId}")]
        public async Task<IActionResult> UploadExcel(IFormFile file, int warehouseId)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Chưa có file nào được tải lên.");
            }

            var results = new List<string>();

            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var package = new ExcelPackage(stream))
                    {
                        var worksheet = package.Workbook.Worksheets[0];
                        int rowCount = worksheet.Dimension.Rows;

                        for (int row = 2; row <= rowCount; row++)
                        {
                            var goodsCode = worksheet.Cells[row, 1].Value?.ToString();
                            var goodsName = worksheet.Cells[row, 2].Value?.ToString();
                            var categoryId = worksheet.Cells[row, 3].Value?.ToString();
                            var description = worksheet.Cells[row, 4].Value?.ToString();
                            var supplierId = worksheet.Cells[row, 5].Value?.ToString();
                            var unit = worksheet.Cells[row, 6].Value?.ToString();
                            var image = worksheet.Cells[row, 7].Value?.ToString();
                            var warrantyTime = worksheet.Cells[row, 8].Value?.ToString();
                            var maxStock = worksheet.Cells[row, 9].Value?.ToString();
                            var minStock = worksheet.Cells[row, 10].Value?.ToString();

                            var errors = new List<string>();

                            if (string.IsNullOrEmpty(goodsCode))
                                errors.Add("Mã hàng hóa không được để trống.");
                            if (string.IsNullOrEmpty(goodsName))
                                errors.Add("Tên hàng hóa không được để trống.");
                            if (string.IsNullOrEmpty(categoryId) || !_context.Categories.Any(c => c.CategoryId == int.Parse(categoryId)))
                                errors.Add("Mã danh mục không hợp lệ hoặc trống.");
                            if (string.IsNullOrEmpty(supplierId) || !_context.Suppliers.Any(s => s.SupplierId == int.Parse(supplierId)))
                                errors.Add("Mã nhà cung cấp không hợp lệ hoặc trống.");
                            if (string.IsNullOrEmpty(unit) || (unit != "Thùng" && unit != "Kg"))
                                errors.Add("Đơn vị tính không hợp lệ hoặc trống.");
                            if (string.IsNullOrEmpty(warrantyTime))
                                errors.Add("Thời gian bảo hành không được để trống.");
                            if (string.IsNullOrEmpty(maxStock))
                                errors.Add("Số lượng tồn kho tối đa không được để trống.");
                            if (string.IsNullOrEmpty(minStock))
                                errors.Add("Số lượng tồn kho tối thiểu không được để trống.");

                            if (errors.Count > 0)
                            {
                                results.Add($"Lỗi ở hàng {row}: " + string.Join(", ", errors));
                                continue;
                            }

                            string countryCode = "VN";
                            string year = DateTime.Now.Year.ToString().Substring(2, 2);
                            string barcode = $"{countryCode}{year}{goodsCode}";

                            var goodsRequest = new CreateGoodsRequest
                            {
                                GoodsCode = goodsCode,
                                GoodsName = goodsName,
                                CategoryId = int.Parse(categoryId.Trim()),
                                Description = description,
                                SupplierId = int.Parse(supplierId.Trim()),
                                MeasuredUnit = unit,
                                Image = image,
                                StatusId = 1,
                                StockPrice = 0,
                                WarrantyTime = int.Parse(warrantyTime.Trim()),
                                Barcode = barcode,
                                MaxStock = int.Parse(maxStock),
                                MinStock = int.Parse(minStock),
                                CreatedDate = DateTime.Now
                            };

                            var response = _goodsService.AddGoodsByAdmin(goodsRequest, warehouseId);

                            if (response.IsSuccess)
                            {
                                results.Add($"Hàng hóa {goodsName} đã được thêm vào kho.");
                            }
                            else
                            {
                                results.Add($"Lỗi khi thêm hàng hóa {goodsName} ở hàng {row}: {response.Message}");
                            }
                        }

                        return Ok(new { Message = "Tải lên hoàn tất!", Results = results });
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Đã xảy ra lỗi: {ex.Message}");
            }
        }



    }
}