using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.DTOs;
using iSmart.Entity.DTOs.ImportOrderDetailDTO;
using iSmart.Entity.DTOs.ImportOrderDTO;
using iSmart.Entity.Models;
using iSmart.Service;
using Microsoft.EntityFrameworkCore;

namespace iSmart.Service
{
    public interface IImportOrderDetailService
    {
        List<ImportOrderDetail> GetAllOrderDetails();
        CreateImportOrderDetailResponse AddOrderDetail(CreateImportOrderDetailRequest detail);
        UpdateImportOrderDetailResponse UpdateOrderDetail(UpdateImportOrderDetailRequest detail);
        bool DeleteImportOrderDetail(int id);

        BatchInventoryDTO GetBatchInventoryByBatchCode(string batchCode);


        List<ImportOrderDetailResponse> GetOrderDetailsByOrderID(int oid);

        List<BatchInventoryDTO> SelectBatchesForExport(int warehouseId, int goodId, int quantity, string method);
        List<BatchInventoryDTO> GetBatchInventoryByGoodsId(int warehouseId, int goodId);
        List<BatchInventoryDTO> GetBatchForReturn(int warehouseId, int goodId);
    }
    public class ImportOrderDetailService : IImportOrderDetailService
    {
        private readonly iSmartContext _context;
        private readonly IImportOrderService _orderService;
        private iSmartContext context;

        public ImportOrderDetailService(iSmartContext context, IImportOrderService orderService)
        {
            _context = context;
            _orderService = orderService;
        }

        public ImportOrderDetailService(iSmartContext context)
        {
            _context = context;
        }
        public List<BatchInventoryDTO> SelectBatchesForExport(int warehouseId, int goodId, int quantity, string method)
        {
            List<BatchInventoryDTO> selectedBatches = new List<BatchInventoryDTO>();

            // Lấy danh sách các lô hàng có sẵn cho sản phẩm productId
            List<BatchInventoryDTO> batches = GetBatchInventoryByGoodsId(warehouseId, goodId);

            if (method == "FIFO")
            {
                batches = batches.OrderBy(b => b.ImportedDate).ToList();
            }
            else if (method == "LIFO")
            {
                // Sắp xếp các lô hàng theo ngày nhận từ sau về trước (LIFO)
                batches = batches.OrderByDescending(b => b.ImportedDate).ToList();
            }
            else
            {
                throw new ArgumentException("Phương pháp quản lý kho không hợp lệ.");
            }

            foreach (var batch in batches)
            {
                // Nếu số lượng cần xuất đã đủ, thoát khỏi vòng lặp
                if (quantity <= 0)
                {
                    break;
                }

                // Chỉ xử lý lô hàng nếu còn sản phẩm
                if (batch.ActualQuantity > 0)
                {
                    // Lấy số lượng nhỏ nhất giữa số lượng cần xuất và số lượng còn lại trong lô
                    int quantityToTake = Math.Min(batch.ActualQuantity, quantity);

                    if (quantityToTake > 0) // Chỉ thêm vào nếu số lượng cần lấy lớn hơn 0
                    {
                        // Tạo một bản sao của lô hàng để tránh ảnh hưởng đến cơ sở dữ liệu
                        BatchInventoryDTO selectedBatch = new BatchInventoryDTO
                        {
                            ImportOrderDetailId = batch.ImportOrderDetailId,
                            BatchCode = batch.BatchCode,
                            Quantity = quantityToTake,  // Số lượng lấy từ lô
                            CostPrice = batch.CostPrice,
                            ManufactureDate = batch.ManufactureDate,
                            ExpiryDate = batch.ExpiryDate,
                            ActualQuantity = batch.ActualQuantity - quantityToTake, // Cập nhật số lượng còn lại trong lô
                            Location = batch.Location
                        };

                        // Thêm lô hàng đã chọn vào danh sách
                        selectedBatches.Add(selectedBatch);

                        // Trừ số lượng cần xuất từ tổng số lượng yêu cầu
                        quantity -= quantityToTake;

                        // Cập nhật số lượng thực tế còn lại trong lô hàng
                        batch.ActualQuantity -= quantityToTake;
                    }
                }
            }

            return selectedBatches;
        }
        public List<BatchInventoryDTO> GetBatchInventoryByGoodsId(int warehouseId, int goodId)
        {
            try
            {
                var batchGoods = (List<BatchInventoryDTO>)_context.ImportOrderDetails.Include(i => i.Import).Where(i => i.Import.StatusId == 4 && i.GoodsId == goodId && i.Import.WarehouseId == warehouseId && i.ActualQuantity != 0)
                    .Select(s => new BatchInventoryDTO
                    {
                        ImportOrderDetailId = s.DetailId,
                        BatchCode = s.BatchCode,
                        Quantity = s.Quantity,
                        ActualQuantity = s.ActualQuantity,
                        CostPrice = s.CostPrice,
                        ManufactureDate = s.ManufactureDate,
                        ExpiryDate = s.ExpiryDate,
                        ImportedDate = s.Import.ImportedDate,
                    }).ToList();
                return batchGoods;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public List<ImportOrderDetail> GetAllOrderDetails()
        {
            try
            {
                var details = _context.ImportOrderDetails.ToList();
                return details;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public CreateImportOrderDetailResponse AddOrderDetail(CreateImportOrderDetailRequest detail)
        {
            try
            {
                var existingDetail = _context.ImportOrderDetails
                    .FirstOrDefault(d => d.BatchCode == detail.BatchCode);

                if (existingDetail != null)
                {
                    return new CreateImportOrderDetailResponse
                    {
                        IsSuccess = false,
                        Message = "BatchCode already exists for this import order."
                    };
                }
                var requestOrder = new ImportOrderDetail
                {
                    ImportId = detail.ImportId,
                    GoodsId = (int)detail.GoodsId,
                    Quantity = (int)detail.Quantity,
                    ActualQuantity = (int)detail.Quantity,
                    CostPrice = detail.CostPrice,
                    BatchCode = detail.BatchCode,
                    ExpiryDate = detail.ExpiryDate,
                    ManufactureDate = detail.ManufactureDate,
                };
                _context.ImportOrderDetails.Add(requestOrder);
                _context.SaveChanges();

                // Calculate total cost and update ImportOrder's TotalCost
                var importOrder = _context.ImportOrders.FirstOrDefault(io => io.ImportId == detail.ImportId);
                if (importOrder != null)
                {
                    decimal totalCost = (decimal)importOrder.ImportOrderDetails.Sum(iod => iod.Quantity * iod.CostPrice);
                    importOrder.TotalCost = (float)totalCost;
                    _context.SaveChanges();
                }

                return new CreateImportOrderDetailResponse { IsSuccess = true, Message = "Add order detail complete" };
            }
            catch (Exception e)
            {
                return new CreateImportOrderDetailResponse { IsSuccess = false, Message = $"Add order detail failed {e.Message}" };

            }
        }

        public BatchInventoryDTO GetBatchInventoryByBatchCode(string batchcode)
        {
            try
            {
                var batchGood = _context.ImportOrderDetails
                    .Include(i => i.Import)
                    .Where(i => i.Import.StatusId == 4 && i.BatchCode == batchcode)
                    .Select(s => new BatchInventoryDTO
                    {
                        ImportOrderDetailId = s.DetailId,
                        BatchCode = s.BatchCode,
                        Quantity = s.Quantity,
                        ActualQuantity = s.ActualQuantity,
                        CostPrice = s.CostPrice,
                        ManufactureDate = s.ManufactureDate,
                        ExpiryDate = s.ExpiryDate
                    })
                    .FirstOrDefault(); // Lấy lô hàng đầu tiên khớp với điều kiện

                return batchGood;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public bool DeleteImportOrderDetail(int id)
        {
            try
            {

                var order = _context.ImportOrderDetails.SingleOrDefault(x => x.DetailId == id);
                _context.ImportOrderDetails.Remove(order);
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }



        public List<ImportOrderDetailResponse> GetOrderDetailsByOrderID(int oid)
        {
            try
            {
                var details = _context.ImportOrderDetails.Include(iod => iod.Import).ThenInclude(iod => iod.Supplier).Include(iod => iod.Import).ThenInclude(iod => iod.Warehouse).Where(i => i.ImportId == oid)
                  .Select(i => new ImportOrderDetailResponse
                  {
                      DetailId = i.DetailId,
                      ImportId = i.ImportId,
                      CostPrice = i.CostPrice,
                      GoodsId = i.GoodsId,
                      GoodsCode = i.Goods.GoodsCode,
                      Quantity = i.Quantity,
                      BatchCode = i.BatchCode,
                      ExpiryDate = i.ExpiryDate,
                      ManufactureDate = i.ManufactureDate,
                      SupplierName = i.Import.Supplier.SupplierName,
                      WarehouseName = i.Import.Warehouse.WarehouseName, 
                  }).ToList();
                return details;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }


        public UpdateImportOrderDetailResponse UpdateOrderDetail(UpdateImportOrderDetailRequest detail)
        {
            try
            {
                // Tìm import order detail hiện tại bằng ImportId và GoodsId hoặc các điều kiện cần thiết
                var existingOrderDetail = _context.ImportOrderDetails
                    .FirstOrDefault(x => x.DetailId == detail.DetailId);

                if (existingOrderDetail != null)
                {
                    // Cập nhật các trường thông tin
                    existingOrderDetail.Quantity = (int)detail.Quantity;
                    existingOrderDetail.ActualQuantity = (int)detail.Quantity;
                    existingOrderDetail.CostPrice = detail.CostPrice;
                    existingOrderDetail.BatchCode = detail.BatchCode;
                    existingOrderDetail.ExpiryDate = detail.ExpiryDate;
                    existingOrderDetail.ManufactureDate = detail.ManufactureDate;

                    _context.Update(existingOrderDetail);
                    _context.SaveChanges();
                    return new UpdateImportOrderDetailResponse { IsSuccess = true, Message = "Update order detail complete" };
                }
                else
                {
                    return new UpdateImportOrderDetailResponse { IsSuccess = false, Message = "Order detail not found" };
                }
            }
            catch (Exception e)
            {
                return new UpdateImportOrderDetailResponse { IsSuccess = false, Message = $"Update order detail failed: {e.Message}" };
            }
        }


        public List<BatchInventoryDTO> GetBatchForReturn(int warehouseId, int goodId)
        {
            try
            {
                var batchGoods = (List<BatchInventoryDTO>)_context.ImportOrderDetails.Include(i => i.Import).Include(i => i.Goods).Where(i => i.Import.StatusId == 4 && i.GoodsId == goodId && i.Import.WarehouseId == warehouseId && i.Import.SupplierId != 1&& i.ActualQuantity!=0)
                    .Select(s => new BatchInventoryDTO
                    {
                        ImportOrderDetailId = s.DetailId,
                        BatchCode = s.BatchCode,
                        Quantity = s.ActualQuantity,
                        CostPrice = s.CostPrice,
                        ManufactureDate = s.ManufactureDate,
                        ExpiryDate = s.ExpiryDate
                    }).ToList();
                return batchGoods;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}