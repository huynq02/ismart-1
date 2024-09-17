using iSmart.Entity.DTOs.ReportDTO;
using iSmart.Entity.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Service
{
    public interface IReportService
    {
        Task<IEnumerable<ImportReportDto>> GetImportReport(DateTime? startDate, DateTime? endDate, int warehouseId);
        Task<IEnumerable<ImportReportDto>> GetImportReportByGoodCode(DateTime? startDate, DateTime? endDate, int warehouseId, string goodCode);
        Task<IEnumerable<ExportReportDto>> GetExportReport(DateTime? startDate, DateTime? endDate, int warehouseId);
        Task<IEnumerable<InventoryReportDto>> GetInventoryReport(DateTime? startDate, DateTime? endDate, int warehouseId);
        Task<IEnumerable<MonthlyInventoryReportDto>> GetInventoryReportByMonth(int warehouseId, string goodCode, int year);
    }
    public class ReportService : IReportService
    {
        private readonly iSmartContext _context;

        public ReportService(iSmartContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<ExportReportDto>> GetExportReport(DateTime? startDate, DateTime? endDate, int warehouseId)
        {
            try
            {
                var query = _context.ExportOrders
                    .Where(e => e.WarehouseId == warehouseId && e.StatusId == 4)
                    .Include(e => e.Warehouse)
                    .Include(e => e.ExportOrderDetails)
                    .ThenInclude(eod => eod.Goods)
                    .AsQueryable();

                if (startDate.HasValue && endDate.HasValue)
                {
                    endDate = endDate.Value.AddDays(1);
                    query = query.Where(e => e.ExportedDate >= startDate.Value && e.ExportedDate <= endDate.Value);
                }

                var exportReports = await query
                    .SelectMany(e => e.ExportOrderDetails.Select(eod => new ExportReportDto
                    {
                        TransactionCode = eod.Export.ExportCode,
                        ProductId = (int)eod.GoodsId,
                        ProductName = eod.Goods.GoodsCode,
                        Quantity = (int)eod.Quantity,
                        MeasureUnit = eod.Goods.MeasuredUnit,
                        TransactionDate = (DateTime)e.ExportedDate
                    }))
                    .ToListAsync();

                return exportReports;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }




        public async Task<IEnumerable<ImportReportDto>> GetImportReport(DateTime? startDate, DateTime? endDate, int warehouseId)
        {
            try
            {
                var query = _context.ImportOrders
                    .Where(io => io.WarehouseId == warehouseId && io.StatusId == 4)
                    .Include(io => io.Warehouse)
                    .Include(io => io.ImportOrderDetails)
                    .ThenInclude(iod => iod.Goods)
                    .AsQueryable();

                if (startDate.HasValue && endDate.HasValue)
                {
                    endDate = endDate.Value.AddDays(1);
                    query = query.Where(io => io.ImportedDate >= startDate.Value && io.ImportedDate <= endDate.Value);
                }

                var importReports = await query
                    .SelectMany(io => io.ImportOrderDetails.Select(iod => new ImportReportDto
                    {
                        TransactionCode = io.ImportCode,
                        ProductId = iod.GoodsId,
                        ProductName = iod.Goods.GoodsCode,
                        Quantity = iod.Quantity,
                        MeasureUnit = iod.Goods.MeasuredUnit,
                        TransactionDate = (DateTime)io.ImportedDate
                    }))
                    .ToListAsync();

                return importReports;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }




        public async Task<IEnumerable<ImportReportDto>> GetImportReportByGoodCode(DateTime? startDate, DateTime? endDate, int warehouseId, string goodCode)
        {
            var query = _context.ImportOrders
                .Where(io => io.WarehouseId == warehouseId && io.StatusId == 4)
                .Include(io => io.Warehouse)
                .Include(io => io.ImportOrderDetails)
                .ThenInclude(iod => iod.Goods)
                .AsQueryable();

            if (startDate.HasValue && endDate.HasValue)
            {
                endDate = endDate.Value.AddDays(1);
                query = query.Where(io => io.ImportedDate >= startDate.Value && io.ImportedDate <= endDate.Value);
            }

            var importReports = await query
                .SelectMany(io => io.ImportOrderDetails
                    .Where(iod => iod.Goods.GoodsCode == goodCode)
                    .Select(iod => new ImportReportDto
                    {
                        TransactionCode = io.ImportCode,
                        ProductId = iod.GoodsId,
                        ProductName = iod.Goods.GoodsCode,
                        Quantity = iod.Quantity,
                        TransactionDate = (DateTime)io.ImportedDate,
                        MeasureUnit = iod.Goods.MeasuredUnit
                    })
                )
                .ToListAsync();

            return importReports;
        }



        public async Task<IEnumerable<InventoryReportDto>> GetInventoryReport(DateTime? startDate, DateTime? endDate, int warehouseId)
        {
            try
            {
                var query = _context.ImportOrders
                    .Where(io => io.WarehouseId == warehouseId && io.StatusId == 4)
                    .Include(io => io.ImportOrderDetails)
                    .ThenInclude(iod => iod.Goods)
                    .AsQueryable();

                if (startDate.HasValue && endDate.HasValue)
                {
                    endDate = endDate.Value.AddDays(1);
                    query = query.Where(io => io.ImportedDate >= startDate.Value && io.ImportedDate <= endDate.Value);
                }

                var importReports = await query
                    .SelectMany(io => io.ImportOrderDetails.Select(iod => new InventoryReportDto
                    {
                        TransactionCode = iod.Import.ImportCode,
                        ProductId = iod.GoodsId,
                        ProductName = iod.Goods.GoodsCode,
                        Imports = iod.Quantity,
                        Exports = 0,
                        MeasureUnit = iod.Goods.MeasuredUnit
                    }))
                    .ToListAsync();

                var exportReportsQuery = _context.ExportOrders
                    .Where(eo => eo.WarehouseId == warehouseId && eo.StatusId == 4)
                    .Include(eo => eo.ExportOrderDetails)
                    .ThenInclude(eod => eod.Goods)
                    .AsQueryable();

                if (startDate.HasValue && endDate.HasValue)
                {
                    exportReportsQuery = exportReportsQuery.Where(eo => eo.ExportedDate >= startDate.Value && eo.ExportedDate <= endDate.Value);
                }

                var exportReports = await exportReportsQuery
                    .SelectMany(eo => eo.ExportOrderDetails.Select(eod => new InventoryReportDto
                    {
                        TransactionCode = eod.Export.ExportCode,
                        ProductId = (int)eod.GoodsId,
                        ProductName = eod.Goods.GoodsCode,
                        Imports = 0,
                        Exports = (int)eod.Quantity,
                        MeasureUnit = eod.Goods.MeasuredUnit,
                    }))
                    .ToListAsync();

                var inventoryReports = importReports
                   .Concat(exportReports)
                   .GroupBy(ir => new { ir.ProductId, ir.ProductName, ir.MeasureUnit })
                   .Select(g => new InventoryReportDto
                   {
                       ProductId = g.Key.ProductId,
                       ProductName = g.Key.ProductName,
                       MeasureUnit = g.Key.MeasureUnit,
                       Imports = g.Sum(x => x.Imports),
                       Exports = g.Sum(x => x.Exports),
                       Balance = g.Sum(x => x.Imports) - g.Sum(x => x.Exports)
                   })
                   .ToList();

                return inventoryReports;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<IEnumerable<MonthlyInventoryReportDto>> GetInventoryReportByMonth(int warehouseId, string goodCode, int year)
        {
            try
            {
                // Lấy dữ liệu nhập khẩu
                var importQuery = _context.ImportOrders
                    .Where(io => io.WarehouseId == warehouseId && io.StatusId == 4 && io.ImportOrderDetails.Any(iod => iod.Goods.GoodsCode == goodCode))
                    .Include(io => io.ImportOrderDetails)
                    .ThenInclude(iod => iod.Goods)
                    .AsQueryable();

                importQuery = importQuery.Where(io => io.ImportedDate.HasValue && io.ImportedDate.Value.Year == year);

                var importReports = await importQuery
                    .SelectMany(io => io.ImportOrderDetails
                        .Where(iod => iod.Goods.GoodsCode == goodCode)
                        .Select(iod => new
                        {
                            Month = io.ImportedDate.Value.Month,
                            Imports = iod.Quantity
                        }))
                    .ToListAsync();

                // Lấy dữ liệu xuất khẩu
                var exportQuery = _context.ExportOrders
                    .Where(eo => eo.WarehouseId == warehouseId && eo.StatusId == 4 && eo.ExportOrderDetails.Any(eod => eod.Goods.GoodsCode == goodCode))
                    .Include(eo => eo.ExportOrderDetails)
                    .ThenInclude(eod => eod.Goods)
                    .AsQueryable();

                exportQuery = exportQuery.Where(eo => eo.ExportedDate.HasValue && eo.ExportedDate.Value.Year == year);

                var exportReports = await exportQuery
                    .SelectMany(eo => eo.ExportOrderDetails
                        .Where(eod => eod.Goods.GoodsCode == goodCode)
                        .Select(eod => new
                        {
                            Month = eo.ExportedDate.Value.Month,
                            Exports = eod.Quantity
                        }))
                    .ToListAsync();

                var monthlyReports = importReports
                    .GroupBy(ir => ir.Month)
                    .Select(g => new MonthlyInventoryReportDto
                    {
                        Month = g.Key,
                        Imports = g.Sum(x => x.Imports),
                        Exports = (int)exportReports.Where(er => er.Month == g.Key).Sum(x => x.Exports)
                    })
                    .ToList();

                for (int month = 1; month <= 12; month++)
                {
                    if (!monthlyReports.Any(m => m.Month == month))
                    {
                        monthlyReports.Add(new MonthlyInventoryReportDto
                        {
                            Month = month,
                            Imports = 0,
                            Exports = 0
                        });
                    }
                }

                return monthlyReports.OrderBy(m => m.Month).ToList();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }


    }
    public class MonthlyInventoryReportDto
    {
        public int Month { get; set; }
        public int Imports { get; set; }
        public int Exports { get; set; }
    }
}


