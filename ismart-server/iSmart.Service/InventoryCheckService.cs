using iSmart.Entity.DTOs.CategoryDTO;
using iSmart.Entity.DTOs.ImportOrderDTO;
using iSmart.Entity.DTOs.InventoryCheckDTO;
using iSmart.Entity.Migrations;
using iSmart.Entity.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Service
{
    public interface IInventoryCheckService
    {
        CreateInventoryCheckResponse CreateInventoryCheck(CreateInventoryCheckDTO inventoryCheck);
        Task<List<CreateInventoryCheckDTO>> GetAllInventoryChecksAsync(int? warehouseId);
        Task<ResponseInventoryCheckDTO> GetInventoryCheckByIdAsync(int id);
        Task UpdateBatchQuantitiesAsync(Dictionary<string, int> batchQuantities);
    }

    public class InventoryCheckService : IInventoryCheckService
    {
        private readonly iSmartContext _context;
        public InventoryCheckService(iSmartContext context)
        {
            _context = context;
        }

        //public CreateInventoryCheckResponse CreateInventoryCheck(CreateInventoryCheckDTO inventoryCheckDTO)
        //{
        //    try
        //    {
        //        var inventoryCheck = new InventoryCheck
        //        {
        //            WarehouseId = inventoryCheckDTO.WarehouseId,
        //            CheckDate = inventoryCheckDTO.CheckDate,
        //            StatusId = 3
        //        };
        //        _context.InventoryChecks.Add(inventoryCheck);
        //        _context.SaveChanges();
        //        foreach (var detail in inventoryCheckDTO.InventoryCheckDetails)
        //        {
        //            var good = _context.Goods.SingleOrDefault(g => g.GoodsCode == detail.GoodCode);
        //            if (good == null)
        //            {
        //                throw new Exception($"Good with code {detail.GoodCode} not found.");
        //            } 
        //            int inventoryCheckId = inventoryCheck.Id;
        //            var inventoryCheckDetail = new InventoryCheckDetail
        //            {
        //                InventoryCheckId = inventoryCheckId,
        //                GoodId = good.GoodsId,
        //                ExpectedQuantity = detail.ExpectedQuantity,
        //                ActualQuantity = detail.ActualQuantity,
        //                note = detail.Note
        //            };
        //            _context.InventoryCheckDetails.Add(inventoryCheckDetail);
        //        }
        //        _context.SaveChanges();
        //        return new CreateInventoryCheckResponse { IsSuccess = true, Message = "Tạo phiếu kiểm kê thành công" };
        //    }
        //    catch (Exception ex)
        //    {
        //        return new CreateInventoryCheckResponse { IsSuccess = false, Message = $"Tạo phiếu kiểm kê thất bại: {ex.Message}" };
        //    }
        //}
        public CreateInventoryCheckResponse CreateInventoryCheck(CreateInventoryCheckDTO inventoryCheckDTO)
        {
            try
            {
                var inventoryCheck = new InventoryCheck
                {
                    WarehouseId = inventoryCheckDTO.WarehouseId,
                    CheckDate = DateTime.Now,
                    StatusId = 3
                };
                _context.InventoryChecks.Add(inventoryCheck);
                _context.SaveChanges();

                foreach (var detail in inventoryCheckDTO.InventoryCheckDetails)
                {
                    var good = _context.Goods.SingleOrDefault(g => g.GoodsCode == detail.GoodCode);
                    if (good == null)
                    {
                        throw new Exception($"Good with code {detail.GoodCode} not found.");
                    }

                    int inventoryCheckId = inventoryCheck.Id;
                    var inventoryCheckDetail = new InventoryCheckDetail
                    {
                        InventoryCheckId = inventoryCheckId,
                        GoodId = good.GoodsId,
                        ExpectedQuantity = detail.BatchDetails.Sum(b => b.ExpectedQuantity),
                        ActualQuantity = detail.BatchDetails.Sum(b => b.ActualQuantity),
                        note = detail.Note
                    };
                    _context.InventoryCheckDetails.Add(inventoryCheckDetail);
                    _context.SaveChanges();

                    foreach (var batch in detail.BatchDetails)
                    {
                        var batchDetail = new Entity.Models.BatchCheckingDetail
                        {
                            InventoryCheckDetailId = inventoryCheckDetail.Id,
                            BatchCode = batch.BatchCode,
                            ExpectedQuantity = batch.ExpectedQuantity,
                            ActualQuantity = batch.ActualQuantity,
                            Note = batch.Note
                        };
                        _context.BatchDetails.Add(batchDetail);
                    }
                }

                _context.SaveChanges();
                return new CreateInventoryCheckResponse { IsSuccess = true, Message = "Tạo phiếu kiểm kê thành công" };
            }
            catch (Exception ex)
            {
                return new CreateInventoryCheckResponse { IsSuccess = false, Message = $"Tạo phiếu kiểm kê thất bại: {ex.Message}" };
            }
        }


        public async Task<List<CreateInventoryCheckDTO>> GetAllInventoryChecksAsync(int? warehouseId)
        {
            try
            {
                var query = _context.InventoryChecks.AsQueryable();

                if (warehouseId.HasValue)
                {
                    query = query.Where(ic => ic.WarehouseId == warehouseId.Value);
                }

                return await query
                    .Select(ic => new CreateInventoryCheckDTO
                    {
                        InventoryCheckId = ic.Id,
                        WarehouseId = ic.WarehouseId,
                        CheckDate = ic.CheckDate,
                        status = ic.StatusId == 3 ? "On Progress" :
                         ic.StatusId == 4 ? "Completed" : "Cancel",
                        InventoryCheckDetails = ic.InventoryCheckDetails.Select(d => new InventoryCheckDetailDTO
                        {
                            GoodCode = _context.Goods.FirstOrDefault(g => g.GoodsId == d.GoodId).GoodsCode,
                            ExpectedQuantity = d.ExpectedQuantity,
                            ActualQuantity = d.ActualQuantity,
                            Note = d.note,
                            BatchDetails = _context.BatchDetails
                                       .Where(b => b.InventoryCheckDetailId == d.Id)
                                       .Select(b => new CreateBatchDetailDTO
                                       {
                                           BatchCode = b.BatchCode,
                                           ExpectedQuantity = b.ExpectedQuantity,
                                           ActualQuantity = b.ActualQuantity,
                                           Note = b.Note
                                       }).ToList()
                        }).ToList()
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while fetching inventory checks.", ex);
            }
        }


        public async Task<ResponseInventoryCheckDTO> GetInventoryCheckByIdAsync(int id)
        {
            var inventoryCheck = await _context.InventoryChecks
                .Include(i => i.Warehouse)
                .ThenInclude(i => i.UserWarehouses)
                .ThenInclude(i => i.User)
                .ThenInclude(i => i.Role)
                .Include(ic => ic.InventoryCheckDetails)
                .ThenInclude(d => d.Good)
                .Include(ic => ic.InventoryCheckDetails)
                .ThenInclude(d => d.BatchDetails)
                .FirstOrDefaultAsync(ic => ic.Id == id);

            if (inventoryCheck == null)
            {
                throw new Exception($"Inventory Check with ID {id} not found.");
            }

            var groupedDetails = inventoryCheck.InventoryCheckDetails
                .GroupBy(i => i.GoodId)
                .Select(g => new ResponseInventoryCheckDetailDTO
                {
                    goodCode = g.First().Good.GoodsCode,
                    goodName = g.First().Good.GoodsName,
                    ActualQuantity = g.Sum(i => i.ActualQuantity),
                    InAppQuantity = g.Sum(i => i.ExpectedQuantity),
                    Difference = g.Sum(i => i.ExpectedQuantity) - g.Sum(i => i.ActualQuantity),
                    MeasureUnit = g.First().Good.MeasuredUnit,
                    Note = string.Join(", ", g.Select(i => i.note).Where(n => !string.IsNullOrEmpty(n))),
                    BatchDetails = g.SelectMany(i => i.BatchDetails)
                                    .GroupBy(b => b.BatchCode)
                                    .Select(b => new ResponseBatchDetailDTO
                                    {
                                        BatchCode = b.Key,
                                        ExpectedQuantity = b.Sum(x => x.ExpectedQuantity),
                                        ActualQuantity = b.Sum(x => x.ActualQuantity),
                                        Note = string.Join(", ", b.Select(x => x.Note).Where(n => !string.IsNullOrEmpty(n)))
                                    }).ToList()
                }).ToList();

            return new ResponseInventoryCheckDTO
            {
                AccountantName = inventoryCheck.Warehouse.UserWarehouses.FirstOrDefault(i => i.User.RoleId == 4)?.User.UserName,
                WarehouseName = inventoryCheck.Warehouse.WarehouseName,
                WarehouseAddress = inventoryCheck.Warehouse.WarehouseAddress,
                WarehouseManagerName = inventoryCheck.Warehouse.UserWarehouses.FirstOrDefault(i => i.User.RoleId == 2)?.User.UserName,
                CheckDate = inventoryCheck.CheckDate,
                Detail = groupedDetails
            };
        }


        public async Task UpdateBatchQuantitiesAsync(Dictionary<string, int> batchQuantities)
        {
            try
            {
                foreach (var batch in batchQuantities)
                {
                    var batchCode = batch.Key;
                    var quantity = batch.Value;

                    var inventoryBatch = await _context.ImportOrderDetails.Include(i => i.Import).ThenInclude(i => i.Warehouse)
                        .FirstOrDefaultAsync(b => b.BatchCode == batchCode);

                    if (inventoryBatch == null)
                    {
                        throw new Exception($"Batch with code {batchCode} not found.");
                    }
                    var goodsWarehouse = await _context.GoodsWarehouses
                       .FirstOrDefaultAsync(gw => gw.GoodsId == inventoryBatch.GoodsId && gw.WarehouseId == inventoryBatch.Import.WarehouseId);

                    if (goodsWarehouse == null)
                    {
                        throw new Exception($"Goods with ID {inventoryBatch.GoodsId} not found in warehouse {inventoryBatch.Import.WarehouseId}.");
                    }
                    inventoryBatch.Quantity += (quantity - inventoryBatch.ActualQuantity);
                    // Cập nhật số lượng hàng hóa trong kho
                    goodsWarehouse.Quantity += (quantity - inventoryBatch.ActualQuantity); // Adjust based on difference

                    _context.GoodsWarehouses.Update(goodsWarehouse);

                    inventoryBatch.ActualQuantity = quantity;


                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Update failed: {ex.Message}");
            }
        }







    }
}