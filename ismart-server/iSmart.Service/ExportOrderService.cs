using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.DTOs.ExportOrderDTO;
using iSmart.Entity.DTOs.ImportOrderDTO;
using iSmart.Entity.DTOs.UserDTO;
using iSmart.Entity.Models;

namespace iSmart.Service
{
    public interface IExportOrderService
    {
        CreateExportOrderResponse CreateExportOrder(bool isInternalTransfer, CreateExportOrderRequest i, int staffId);
        List<ExportOrderDTO> GetAllExportOrder();
        int GetExportOrderNewest();
        ExportOrderFilterPaging ExportOrderFilterPaging(int pageSize, int page, int? warehouseId, int? userId, int? managerId, int? status, int? sortDate, string? keyword = "");
        UpdateExportOrderResponse UpdateOrder(UpdateExportOrderRequest i);

        ExportOrderDTO GetExportOrderById(int id);
        //ExportOrder? GetExportOrderByOrderCode(string code);

    }
    public class ExportOrderService : IExportOrderService
    {
        private readonly iSmartContext _context;
        private readonly IUserWarehouseService _userWarehouseService;
        private readonly WebSocketService _webSocketService;

        public ExportOrderService(iSmartContext context, IUserWarehouseService userWarehouseService, WebSocketService webSocketService)
        {
            _context = context;
            _userWarehouseService = userWarehouseService;
            _webSocketService = webSocketService;
        }

        public CreateExportOrderResponse CreateExportOrder(bool isInternalTransfer, CreateExportOrderRequest i, int staffId)
        {
            try
            {
                var exportOrder = isInternalTransfer == false ? new ExportOrder
                {
                    ExportCode = "XH" + i.ExportCode,
                    UserId = staffId,
                    TotalPrice = 0,
                    Note = i.Note,
                    StatusId = 3,
                    CreatedDate = DateTime.Now,
                    ExportedDate = i.ExportedDate,
                    WarehouseId = i.WarehouseId,
                    CancelDate = i.CancelDate,
                    DeliveryId = i.DeliveryId,
                    Image = i.Image,
                    StaffId = _userWarehouseService.GetManagerIdByStaffId(staffId),
                    CustomerId = i.CustomerId,
                } : new ExportOrder
                {
                    ExportCode = "XH" + i.ExportCode,
                    UserId = staffId,
                    TotalPrice = 0,
                    Note = i.Note,
                    StatusId = 3,
                    CreatedDate = DateTime.Now,
                    ExportedDate = i.ExportedDate,
                    WarehouseId = i.WarehouseId,
                    CancelDate = i.CancelDate,
                    DeliveryId = i.DeliveryId,
                    Image = i.Image,
                    StaffId = _userWarehouseService.GetManagerIdByStaffId(staffId),
                    CustomerId = 0,
                    WarehouseDestinationId = i.WarehouseDestinationId
                };
                if (_context.ExportOrders.SingleOrDefault(z => exportOrder.ExportCode.ToLower() == z.ExportCode.ToLower()) == null)
                {
                    _context.Add(exportOrder);
                    _context.SaveChanges();
                    Task.Run(() => _webSocketService.SendMessageAsync($"Đơn hàng xuất kho có mã {exportOrder.ExportCode} và ID {exportOrder.ExportId} cần được xác nhận. warehouseId: {i.WarehouseId}"));
                    return new CreateExportOrderResponse { IsSuccess = true, Message = "tao don hang xuat thanh cong" };
                }
                else return new CreateExportOrderResponse { IsSuccess = false, Message = "Ma xuat hang da ton tai" };
            }
            catch (Exception e)
            {
                return new CreateExportOrderResponse { IsSuccess = false, Message = $"Tao don hang xuat that bai +{e.Message}" };
            }
        }

        public List<ExportOrderDTO> GetAllExportOrder()
        {
            try
            {
                var exportOrder = _context.ExportOrders
                    .OrderByDescending(e => e.ExportedDate)
                    .Select(i => new ExportOrderDTO
                    {
                        ExportId = i.ExportId,
                        ExportCode = i.ExportCode,
                        UserId = i.UserId,
                        UserName = i.User.FullName,
                        TotalPrice = i.TotalPrice,
                        Note = i.Note,
                        StatusId = i.StatusId,
                        StatusType = i.Status.StatusType,
                        CreatedDate = i.CreatedDate,
                        ExportedDate = i.ExportedDate,
                        WarehouseId = i.WarehouseId,
                        WarehouseName = i.Warehouse.WarehouseName,
                        CancelDate = i.CancelDate,
                        DeliveryId = i.DeliveryId,
                        DeliveryName = i.Delivery.DeliveryName,
                        Image = i.Image,
                        ManagerId = i.StaffId,
                        ManagerName = _context.Users.FirstOrDefault(u => u.UserId == i.StaffId).UserName,
                        CustomerName = i.Customer.CustomerName,
                        WarehouseDestinationId = i.WarehouseDestinationId,
                        WarehouseDestinationName = _context.Warehouses.FirstOrDefault(u => u.WarehouseId == i.WarehouseDestinationId).WarehouseName,
                        ExportOrderDetails = (List<ExportDetailDTO>)i.ExportOrderDetails.
                        Select(
                            i => new ExportDetailDTO
                            {
                                DetailId = i.DetailId,
                                ExportId = i.ExportId,
                                GoodsId = i.GoodsId,
                                Price = i.Price,
                                Quantity = i.Quantity,
                                GoodsCode = i.Goods.GoodsCode,
                                ImportOrderDetailId = i.ImportOrderDetailId
                            })
                    })
                    .ToList();
                return exportOrder;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public int GetExportOrderNewest()
        {
            var importordernewest = _context.ExportOrders.OrderByDescending(i => i.ExportId).FirstOrDefault();
            if (importordernewest != null)
            {
                return importordernewest.ExportId;
            }
            return 0;
        }

        public ExportOrderFilterPaging ExportOrderFilterPaging(int pageSize, int page, int? warehouseId, int? userId, int? managerId, int? status, int? sortDate, string? keyword = "")
        {
            try
            {
                if (page <= 0) page = 1;

                var exports = _context.ExportOrders
                    .Include(i => i.User)
                    .Include(i => i.Status)
                    .Include(i => i.Warehouse)
                    .Include(i => i.Delivery)
                    .Where(i =>
                        (string.IsNullOrEmpty(keyword) || i.ExportCode.ToLower().Contains(keyword.ToLower()))
                        && (!status.HasValue || i.StatusId == status)
                        && (userId == null || i.UserId == userId)
                        && (managerId == null || i.StaffId == managerId)
                        && (!warehouseId.HasValue || i.WarehouseId == warehouseId)
                    );
                if (sortDate != null)
                {
                    exports = exports.OrderByDescending(s => s.ExportedDate);
                }

                var count = exports.Count();
                var exportOrder = exports.Select(i => new ExportOrderDTO
                {
                    ExportId = i.ExportId,
                    ExportCode = i.ExportCode,
                    UserId = i.UserId,
                    UserName = i.User.FullName,
                    TotalPrice = i.TotalPrice,
                    Note = i.Note,
                    StatusId = i.StatusId,
                    StatusType = i.Status.StatusType,
                    CreatedDate = i.CreatedDate,
                    ExportedDate = i.ExportedDate,
                    WarehouseId = i.WarehouseId,
                    WarehouseName = i.Warehouse.WarehouseName,
                    CancelDate = i.CancelDate,
                    DeliveryId = i.DeliveryId,
                    DeliveryName = i.Delivery.DeliveryName,
                    Image = i.Image,
                    ManagerId = i.StaffId,
                    ManagerName = _context.Users.FirstOrDefault(u => u.UserId == i.StaffId).UserName,
                    CustomerName = i.Customer.CustomerName,
                    WarehouseDestinationId = i.WarehouseDestinationId,
                    WarehouseDestinationName = _context.Warehouses.FirstOrDefault(u => u.WarehouseId == i.WarehouseDestinationId).WarehouseName,
                    ExportOrderDetails = (List<ExportDetailDTO>)i.ExportOrderDetails.
                        Select(
                            i => new ExportDetailDTO
                            {
                                DetailId = i.DetailId,
                                ExportId = i.ExportId,
                                GoodsId = i.GoodsId,
                                Price = i.Price,
                                Quantity = i.Quantity,
                                GoodsCode = i.Goods.GoodsCode,
                                ImportOrderDetailId = i.ImportOrderDetailId
                            })
                });
                var totalPages = (int)Math.Ceiling((double)count / pageSize);

                var res = exportOrder.Skip((page - 1) * pageSize).Take(pageSize).ToList();

                return new ExportOrderFilterPaging
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

        public UpdateExportOrderResponse UpdateOrder(UpdateExportOrderRequest i)
        {
            try
            {
                var exportOrder = new ExportOrder
                {
                    ExportId = i.ExportId,
                    ExportCode = i.ExportCode,
                    UserId = i.UserId,
                    TotalPrice = (float)i.TotalPrice,
                    Note = i.Note,
                    StatusId = (int)i.StatusId,
                    CreatedDate = (DateTime)i.CreatedDate,
                    ExportedDate = i.ExportedDate,
                    WarehouseId = (int)i.WarehouseId,
                    DeliveryId = i.DeliveryId,
                    Image = i.Image,
                    StaffId = i.ManagerId,
                    CustomerId = i.CustomerId
                };
                _context.Update(exportOrder);
                _context.SaveChanges();
                return new UpdateExportOrderResponse { IsSuccess = true, Message = "update export order successfully" };

            }
            catch (Exception e)
            {
                return new UpdateExportOrderResponse { IsSuccess = false, Message = $"update export order failed +{e.Message}" };
            }
        }


        public ExportOrderDTO GetExportOrderById(int id)
        {
            try
            {
                var exportOrder = _context.ExportOrders.Include(i => i.Status).Include(i => i.User).Include(i => i.Warehouse).ThenInclude(i => i.UserWarehouses).Where(i => i.ExportId == id)
                                     .Select(i => new ExportOrderDTO
                                     {
                                         ExportId = i.ExportId,
                                         ExportCode = i.ExportCode,
                                         UserId = i.UserId,
                                         UserName = i.User.FullName,
                                         TotalPrice = i.TotalPrice,
                                         Note = i.Note,
                                         StatusId = i.StatusId,
                                         StatusType = i.Status.StatusType,
                                         CreatedDate = i.CreatedDate,
                                         ExportedDate = i.ExportedDate,
                                         WarehouseId = i.WarehouseId,
                                         WarehouseName = i.Warehouse.WarehouseName,
                                         CancelDate = i.CancelDate,
                                         DeliveryId = i.DeliveryId,
                                         DeliveryName = i.Delivery.DeliveryName,
                                         Image = i.Image,
                                         ManagerId = i.StaffId,
                                         ManagerName = _context.Users.FirstOrDefault(u => u.UserId == i.StaffId).UserName,
                                         CustomerName = i.Customer.CustomerName,
                                         WarehouseDestinationId = i.WarehouseDestinationId,
                                         WarehouseDestinationName = _context.Warehouses.FirstOrDefault(u => u.WarehouseId == i.WarehouseDestinationId).WarehouseName,
                                         ExportOrderDetails = (List<ExportDetailDTO>)i.ExportOrderDetails.
                                                        Select(
                                                            i => new ExportDetailDTO
                                                            {
                                                                DetailId = i.DetailId,
                                                                ExportId = i.ExportId,
                                                                GoodsId = i.GoodsId,
                                                                Price = i.Price,
                                                                Quantity = i.Quantity,
                                                                GoodsCode = i.Goods.GoodsCode,
                                                                ImportOrderDetailId = i.ImportOrderDetailId
                                                            }).ToList()
                                     }).FirstOrDefault();
                return exportOrder;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        //    public ExportOrder? GetExportOrderByOrderCode(string code)
        //    {
        //        try
        //        {
        //            var exportOrder = _context.ExportOrders
        //                .Include(i => i.Status).Include(i => i.User).Include(i => i.Storage).Include(i => i.Storage).Include(i => i.Project)
        //                .FirstOrDefault(i => i.ExportCode.ToLower().Contains(code.ToLower()));
        //            return exportOrder ?? null;
        //        }
        //        catch (Exception e)
        //        {
        //            throw new Exception(e.Message);

        //        }
        //    }


    }
}