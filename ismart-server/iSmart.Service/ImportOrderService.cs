using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.DTOs.ImportOrderDTO;
using iSmart.Entity.DTOs.UserDTO;
using iSmart.Entity.Models;

namespace iSmart.Service
{
    public interface IImportOrderService
    {
        UpdateImportOrderResponse UpdateOrder(UpdateImportOrderRequest i);

        int GetImportOrderNewest();
        List<ImportOrderDTO> GetAllImportOrder();
        ImportOrderDTO GetImportOrderById(int id);

        CreateImportOrderResponse CreateImportOrder(bool isInternalTransfer, CreateImportOrderRequest i, int staffId);
        ImportOrderFilterPaging ImportOrderFilterPaging(int pageSize, int page, int? storage, int? status, int? sortDate, string? keyword = "");
        Task<string> Import(int importid);
    }

    public class ImportOrderService : IImportOrderService
    {
        private readonly iSmartContext _context;
        private readonly IUserWarehouseService _userWarehouseService;
        private readonly WebSocketService _webSocketService;

        public ImportOrderService(iSmartContext context, IUserWarehouseService userWarehouseService, WebSocketService webSocketService)
        {
            _context = context;
            _userWarehouseService = userWarehouseService;
            _webSocketService = webSocketService;
        }

        public List<ImportOrderDTO> GetAllImportOrder()
        {
            try
            {
                var importOrder = _context.ImportOrders
                    .OrderByDescending(g => g.ImportedDate)
                    .Select(i => new ImportOrderDTO
                    {
                        ImportId = i.ImportId,
                        ImportCode = i.ImportCode,
                        UserId = i.UserId,
                        UserName = i.User.UserName,
                        SupplierId = (int)i.SupplierId,
                        SupplierName = i.Supplier.SupplierName,
                        TotalCost = i.TotalCost,
                        Note = i.Note,
                        CreatedDate = i.CreatedDate,
                        ImportedDate = i.ImportedDate,
                        StatusId = i.StatusId,
                        StatusType = i.Status.StatusType,
                        StorageId = i.WarehouseId,
                        StorageName = i.Warehouse.WarehouseName,
                        DeliveryId = i.DeliveryId,
                        DeliveryName = i.Delivery.DeliveryName,
                        Image = i.Image,
                        StorekeeperId = i.StaffId,
                        ImportOrderDetails = (List<ImportDetailDTO>)i.ImportOrderDetails
                        .Select(
                                i => new ImportDetailDTO
                                {
                                    ImportId = i.ImportId,
                                    CostPrice = i.CostPrice,
                                    GoodsId = i.GoodsId,
                                    GoodsCode = i.Goods.GoodsCode ?? null,
                                    Quantity = i.Quantity,
                                    BatchCode = i.BatchCode,
                                    ManufactureDate = i.ManufactureDate,
                                    ExpiryDate = i.ExpiryDate,
                                })
                    })
                    .ToList();
                return importOrder;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public int GetImportOrderNewest()
        {
            var importOrderNewest = _context.ImportOrders.OrderByDescending(i => i.ImportId).FirstOrDefault();
            if (importOrderNewest != null)
            {
                return importOrderNewest.ImportId;
            }
            return 0;

        }

        public ImportOrderFilterPaging ImportOrderFilterPaging(int pageSize, int page, int? warehouseId, int? status, int? sortDate, string? keyword = "")
        {
            try
            {
                if (page <= 0) page = 1;

                var importOrders = _context.ImportOrders
                    .Include(i => i.User)
                    .Include(i => i.Supplier)
                    .Include(i => i.Status)
                    .Include(i => i.Warehouse)
                    .Include(i => i.Delivery)
                    .Where(i =>
                        (string.IsNullOrEmpty(keyword) || i.ImportCode.ToLower().Contains(keyword.ToLower()))
                        && (!status.HasValue || i.StatusId == status)
                        && (!warehouseId.HasValue || i.WarehouseId == warehouseId)
                    );

                if (sortDate != null)
                {
                    importOrders = importOrders.OrderByDescending(s => s.ImportedDate);
                }

                var count = importOrders.Count();

                var importOrder = importOrders
                    .Select(i => new ImportOrderDTO
                    {
                        ImportId = i.ImportId,
                        ImportCode = i.ImportCode,
                        UserId = i.UserId,
                        UserName = i.User.UserName,
                        SupplierId = (int)i.SupplierId,
                        SupplierName = i.Supplier.SupplierName,
                        TotalCost = i.TotalCost,
                        Note = i.Note,
                        CreatedDate = i.CreatedDate,
                        ImportedDate = i.ImportedDate,
                        StatusId = i.StatusId,
                        StatusType = i.Status.StatusType,
                        StorageId = i.WarehouseId,
                        StorageName = i.Warehouse.WarehouseName,
                        DeliveryId = i.DeliveryId,
                        DeliveryName = i.Delivery.DeliveryName,
                        Image = i.Image,
                        StorekeeperId = i.StaffId,
                        StorekeeperName = _context.Users.FirstOrDefault(u => u.UserId == i.StaffId).UserName,
                        WarehouseDestinationId = i.WarehouseDestinationId,
                        WarehouseDestinationName = _context.Warehouses.FirstOrDefault(u => u.WarehouseId == i.WarehouseDestinationId).WarehouseName,
                        ImportOrderDetails = i.ImportOrderDetails
                            .Select(id => new ImportDetailDTO
                            {
                                ImportId = id.ImportId,
                                CostPrice = id.CostPrice,
                                GoodsId = id.GoodsId,
                                GoodsCode = id.Goods.GoodsCode,
                                Quantity = id.Quantity,
                                BatchCode = id.BatchCode,
                                ManufactureDate = id.ManufactureDate,
                                ExpiryDate = id.ExpiryDate
                            }).ToList()
                    }).ToList();

                var totalPages = (int)Math.Ceiling((double)count / pageSize);

                var res = importOrder.Skip((page - 1) * pageSize).Take(pageSize).ToList();

                return new ImportOrderFilterPaging
                {
                    Data = res,
                    PageSize = pageSize,
                    TotalPages = totalPages
                };
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }



        public CreateImportOrderResponse CreateImportOrder(bool isInternalTransfer, CreateImportOrderRequest i, int staffId)
        {
            try
            {
                var importOrder = isInternalTransfer == true ? new ImportOrder
                {
                    ImportCode = "IMP" + i.ImportCode,
                    UserId = staffId,
                    SupplierId = 1,
                    TotalCost = 0,
                    Note = i.Note,
                    CreatedDate = DateTime.Now,
                    ImportedDate = i.ImportedDate,
                    StatusId = 3,
                    WarehouseId = i.WarehouseId,
                    DeliveryId = i.DeliveryId,
                    Image = i.Image,
                    StaffId = _userWarehouseService.GetManagerIdByStaffId(staffId),
                    WarehouseDestinationId = i.WarehouseDestinationId
                } : new ImportOrder
                {
                    ImportCode = "IMP" + i.ImportCode,
                    UserId = staffId,
                    SupplierId = i.SupplierId,
                    TotalCost = 0,
                    Note = i.Note,
                    CreatedDate = DateTime.Now,
                    ImportedDate = i.ImportedDate,
                    StatusId = 3,
                    WarehouseId = i.WarehouseId,
                    DeliveryId = i.DeliveryId,
                    Image = i.Image,
                    StaffId = _userWarehouseService.GetManagerIdByStaffId(staffId),
                };

                if (_context.ImportOrders.SingleOrDefault(z => importOrder.ImportCode.ToLower() == z.ImportCode.ToLower()) == null)
                {
                    _context.Add(importOrder);
                    _context.SaveChanges();
                    // Gửi thông điệp qua WebSocket
                    Task.Run(() => _webSocketService.SendMessageAsync($"Đơn hàng xuất kho có mã {importOrder.ImportCode} và ID {importOrder.ImportId} cần được xác nhận. warehouseId: {i.WarehouseId}"));
                    return new CreateImportOrderResponse { IsSuccess = true, Message = "Tạo đơn hàng nhập kho thành công" };
                }
                else
                {
                    return new CreateImportOrderResponse { IsSuccess = false, Message = "Mã đơn hàng đã tồn tại" };
                }
            }
            catch (Exception e)
            {
                return new CreateImportOrderResponse { IsSuccess = false, Message = $"Tạo đơn hàng thất bại: {e.Message}" };
            }
        }



        public ImportOrderDTO GetImportOrderById(int id)
        {
            try
            {
                var importOrder = _context.ImportOrders
                    .Include(i => i.Status).Include(i => i.User).Include(i => i.Warehouse).ThenInclude(i => i.UserWarehouses).Where(i => i.ImportId == id)
                     .Select(i => new ImportOrderDTO
                     {
                         ImportId = i.ImportId,
                         ImportCode = i.ImportCode,
                         UserId = i.UserId,
                         UserName = i.User.UserName,
                         SupplierId = (int)i.SupplierId,
                         SupplierName = i.Supplier.SupplierName,
                         TotalCost = i.TotalCost,
                         Note = i.Note,
                         CreatedDate = i.CreatedDate,
                         ImportedDate = i.ImportedDate,
                         StatusId = i.StatusId,
                         StatusType = i.Status.StatusType,
                         StorageId = i.WarehouseId,
                         StorageName = i.Warehouse.WarehouseName,
                         DeliveryId = i.DeliveryId,
                         DeliveryName = i.Delivery.DeliveryName,
                         Image = i.Image,
                         StorekeeperId = i.StaffId,
                         StorekeeperName = _context.Users.FirstOrDefault(u => u.UserId == i.StaffId).UserName,
                         WarehouseDestinationId = i.WarehouseDestinationId,
                         WarehouseDestinationName = _context.Warehouses.FirstOrDefault(u => u.WarehouseId == i.WarehouseDestinationId).WarehouseName,
                         ImportOrderDetails = i.ImportOrderDetails
                            .Select(id => new ImportDetailDTO
                            {
                                ImportId = id.ImportId,
                                CostPrice = id.CostPrice,
                                GoodsId = id.GoodsId,
                                GoodsCode = id.Goods.GoodsCode,
                                Quantity = id.Quantity,
                                BatchCode = id.BatchCode,
                                ManufactureDate = id.ManufactureDate,
                                ExpiryDate = id.ExpiryDate
                            }).ToList()
                     }).FirstOrDefault();
                return importOrder ?? null;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }



        public UpdateImportOrderResponse UpdateOrder(UpdateImportOrderRequest i)
        {
            try
            {


                var importOrder = new ImportOrder
                {
                    ImportId = i.ImportId,
                    ImportCode = i.ImportCode,
                    UserId = i.UserId,
                    SupplierId = i.SupplierId,
                    TotalCost = i.TotalCost,
                    Note = i.Note,
                    CreatedDate = i.CreatedDate,
                    ImportedDate = i.ImportedDate,
                    StatusId = i.StatusId,
                    WarehouseId = i.StorageId,
                    DeliveryId = i.DeliveryId,
                    Image = i.Image,
                    StaffId = i.StokekeeperId,
                };
                _context.Update(importOrder);
                _context.SaveChanges();
                return new UpdateImportOrderResponse { IsSuccess = true, Message = "Cap nhap don hang nhap vao thanh cong" };
            }
            catch (Exception e)
            {
                return new UpdateImportOrderResponse { IsSuccess = false, Message = $"Cap nhap don hang that bai +{e.Message}" };
            }

        }

        public async Task<string> Import(int importid)
        {
            try
            {
                var result = await _context.ImportOrders
                    .Include(a => a.ImportOrderDetails)
                    .SingleOrDefaultAsync(x => x.ImportId == importid);

                // Kiểm tra nếu đơn hàng tồn tại và trạng thái của đơn hàng là 3
                if (result != null && result.StatusId == 3)
                {
                    // Cập nhật trạng thái đơn hàng và thời gian nhập hàng
                    result.StatusId = 4;
                    result.ImportedDate = DateTime.Now;

                    // Duyệt qua từng chi tiết đơn hàng nhập
                    foreach (var detail in result.ImportOrderDetails)
                    {
                        // Tìm hàng hóa tương ứng với GoodsId trong chi tiết đơn hàng
                        var goods = await _context.Goods
                            .SingleOrDefaultAsync(x => x.GoodsId == detail.GoodsId);

                        if (goods == null)
                        {
                            return $"Goods with ID {detail.GoodsId} not found";
                        }

                        // Tìm thông tin hàng hóa trong kho
                        var goodsWarehouse = await _context.GoodsWarehouses.FirstOrDefaultAsync(x => x.GoodsId == detail.GoodsId && x.WarehouseId == result.WarehouseId);

                        if (goodsWarehouse == null)
                        {
                            // Nếu chưa có thông tin trong kho, tạo mới
                            goodsWarehouse = new GoodsWarehouse
                            {
                                GoodsId = goods.GoodsId,
                                WarehouseId = result.WarehouseId,
                                Quantity = 0
                            };

                            _context.GoodsWarehouses.Add(goodsWarehouse); // Sử dụng Add thay vì AddAsync
                            _context.SaveChanges();
                        }

                        // Tạo bản ghi lịch sử cho hàng hóa
                        var history = new GoodsHistory
                        {
                            GoodsId = goods.GoodsId,
                            ActionId = 1, // Hành động nhập hàng
                            OrderCode = result.ImportCode,
                            UserId = (int)result.UserId,
                            Date = DateTime.Now,
                            Quantity = detail.Quantity
                        };

                        // Cập nhật số lượng hàng trong kho
                        goodsWarehouse.Quantity += detail.Quantity;
                        history.QuantityDifferential = $"{detail.Quantity}";

                        // Cập nhật giá nhập hàng
                        history.CostPrice = goods.StockPrice;
                        goods.StockPrice = detail.CostPrice;

                        // Tính toán sự chênh lệch giá nhập
                        var costdifferential = goods.StockPrice - history.CostPrice;
                        history.CostPriceDifferential = costdifferential != 0 ? $"{costdifferential}" : null;

                        // Cập nhật các thông tin khác cho bản ghi lịch sử
                        history.Quantity = goodsWarehouse.Quantity;

                        _context.GoodsHistories.Add(history);
                        _context.Goods.Update(goods);
                        _context.GoodsWarehouses.Update(goodsWarehouse);
                    }

                    await _context.SaveChangesAsync();
                    return "Thành công";
                }
                else
                {
                    return "Không có dữ liệu";
                }
            }
            catch (Exception ex)
            {
                // Log the exception (ex) for debugging purposes
                return "Internal server error: " + ex.Message;
            }
        }

    }
}