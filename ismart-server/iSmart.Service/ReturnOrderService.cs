using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using iSmart.Entity.DTOs.ReturnOrderDTO;
using iSmart.Entity.Models;
using iSmart.Entity.DTOs.ImportOrderDTO;

namespace iSmart.Service
{
    public interface IReturnOrderService
    {
        CreateReturnOrderResponse CreateReturnOrder(CreateReturnOrderRequest request, int staffId);
        List<ReturnOrderDTO> GetAllReturnOrders();
        ReturnOrderDTO GetReturnOrderById(int id);
        int GetReturnOrderNewest();
        ReturnOrderFilterPaging ReturnOrderFilterPaging(int pageSize, int page, int? warehouseId, int? userId, int? approvedById, int? status, int? sortDate, string? keyword = "");
        UpdateReturnOrderResponse UpdateOrder(UpdateReturnOrderRequest request);
    }

    public class ReturnOrderService : IReturnOrderService
    {
        private readonly iSmartContext _context;
        private readonly IUserWarehouseService _userWarehouseService;
        private readonly WebSocketService _webSocketService;

        public ReturnOrderService(iSmartContext context, IUserWarehouseService userWarehouseService, WebSocketService webSocketService)
        {
            _context = context;
            _userWarehouseService = userWarehouseService;
            _webSocketService = webSocketService;
        }

        public CreateReturnOrderResponse CreateReturnOrder(CreateReturnOrderRequest request, int staffId)
        {
            try
            {
                var returnOrder = new ReturnsOrder
                {
                    ReturnOrderCode = "RO" + request.ReturnOrderCode,
                    CreatedBy = staffId,
                    ReturnedDate = request.ReturnedDate,
                    WarehouseId = request.WarehouseId,
                    SupplierId = request.SupplierId,
                    StatusId = 3, // Default status
                    ApprovedBy = _userWarehouseService.GetManagerIdByStaffId(staffId),
                };

                if (_context.ReturnsOrders.SingleOrDefault(z => returnOrder.ReturnOrderCode.ToLower() == z.ReturnOrderCode.ToLower()) == null)
                {
                    _context.Add(returnOrder);
                    _context.SaveChanges();
                    Task.Run(() => _webSocketService.SendMessageAsync($"Đơn hàng xuất kho có mã {returnOrder.ReturnOrderCode} và ID {returnOrder.ReturnOrderId} cần được xác nhận. warehouseId: {request.WarehouseId}"));
                    return new CreateReturnOrderResponse { IsSuccess = true, Message = "Create return order successfully" };
                }
                else return new CreateReturnOrderResponse { IsSuccess = false, Message = "Return order code already exists" };
            }
            catch (Exception e)
            {
                return new CreateReturnOrderResponse { IsSuccess = false, Message = $"Failed to create return order: {e.Message}" };
            }
        }

        public List<ReturnOrderDTO> GetAllReturnOrders()
        {
            try
            {
                var returnOrders = _context.ReturnsOrders
                    .Select(i => new ReturnOrderDTO
                    {
                        ReturnOrderId = i.ReturnOrderId,
                        ReturnOrderCode = i.ReturnOrderCode,
                        CreatedBy = i.CreatedBy,
                        CreatedByName = i.User.FullName,
                        ReturnedDate = i.ReturnedDate,
                        WarehouseId = i.WarehouseId,
                        WarehouseName = i.Warehouse.WarehouseName,
                        SupplierId = i.SupplierId,
                        SupplierName = i.Supplier.SupplierName,
                        StatusId = i.StatusId,
                        StatusType = i.Status.StatusType,
                        ApprovedBy = i.ApprovedBy,
                        ApprovedByName = i.ApprovedByUser.FullName,
                        ReturnOrderDetails = i.ReturnsOrderDetails
                            .Select(d => new ReturnOrderDetailDto
                            {
                                ReturnOrderDetailId = d.ReturnOrderDetailId,
                                ReturnOrderId = d.ReturnOrderId,
                                GoodsId = d.GoodsId,
                                GoodsCode = d.Goods.GoodsCode,
                                Reason = d.Reason,
                                Quantity = d.Quantity,
                                BatchCode = d.BatchCode
                            }).ToList()
                    })
                    .ToList();
                return returnOrders;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public ReturnOrderDTO GetReturnOrderById(int id)
        {
            try
            {
                var importOrder = _context.ReturnsOrders
                    .Include(i => i.Status).Include(i => i.User).Include(i => i.Warehouse).ThenInclude(i => i.UserWarehouses).Where(i => i.ReturnOrderId == id)
                     .Select(i => new ReturnOrderDTO
                     {
                         ReturnOrderId = i.ReturnOrderId,
                         ReturnOrderCode = i.ReturnOrderCode,
                         CreatedBy = i.CreatedBy,
                         CreatedByName = i.User.FullName,
                         ReturnedDate = i.ReturnedDate,
                         WarehouseId = i.WarehouseId,
                         WarehouseName = i.Warehouse.WarehouseName,
                         SupplierId = i.SupplierId,
                         SupplierName = i.Supplier.SupplierName,
                         StatusId = i.StatusId,
                         StatusType = i.Status.StatusType,
                         ApprovedBy = i.ApprovedBy,
                         ApprovedByName = i.ApprovedByUser.FullName,
                         ReturnOrderDetails = i.ReturnsOrderDetails
                            .Select(d => new ReturnOrderDetailDto
                            {
                                ReturnOrderDetailId = d.ReturnOrderDetailId,
                                ReturnOrderId = d.ReturnOrderId,
                                GoodsId = d.GoodsId,
                                GoodsCode = d.Goods.GoodsCode,
                                Reason = d.Reason,
                                Quantity = d.Quantity,
                                BatchCode = d.BatchCode
                            }).ToList()
                     }).FirstOrDefault();
                return importOrder ?? null;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public int GetReturnOrderNewest()
        {
            var returnOrderNewest = _context.ReturnsOrders.OrderByDescending(i => i.ReturnOrderId).FirstOrDefault();
            return returnOrderNewest?.ReturnOrderId ?? 0;
        }

        public ReturnOrderFilterPaging ReturnOrderFilterPaging(int pageSize, int page, int? warehouseId, int? userId, int? approvedById, int? status, int? sortDate, string? keyword = "")
        {
            try
            {
                if (page <= 0) page = 1;

                var returns = _context.ReturnsOrders
                    .Include(i => i.User)
                    .Include(i => i.Status)
                    .Include(i => i.Warehouse)
                    .Include(i => i.Supplier)
                    .Where(i =>
                        (string.IsNullOrEmpty(keyword) || i.ReturnOrderCode.ToLower().Contains(keyword.ToLower()))
                        && (!status.HasValue || i.StatusId == status)
                        && (!userId.HasValue || i.CreatedBy == userId)
                        && (!approvedById.HasValue || i.ApprovedBy == approvedById)
                        && (!warehouseId.HasValue || i.WarehouseId == warehouseId)
                    );

                if (sortDate.HasValue)
                {
                    returns = returns.OrderBy(s => s.ReturnedDate);
                }

                var count = returns.Count();
                var returnOrders = returns
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(i => new ReturnOrderDTO
                    {
                        ReturnOrderId = i.ReturnOrderId,
                        ReturnOrderCode = i.ReturnOrderCode,
                        CreatedBy = i.CreatedBy,
                        CreatedByName = i.User.FullName,
                        ReturnedDate = i.ReturnedDate,
                        WarehouseId = i.WarehouseId,
                        WarehouseName = i.Warehouse.WarehouseName,
                        SupplierId = i.SupplierId,
                        SupplierName = i.Supplier.SupplierName,
                        StatusId = i.StatusId,
                        StatusType = i.Status.StatusType,
                        ApprovedBy = i.ApprovedBy,
                        ApprovedByName = i.ApprovedByUser.FullName,
                        ReturnOrderDetails = i.ReturnsOrderDetails
                            .Select(d => new ReturnOrderDetailDto
                            {
                                ReturnOrderDetailId = d.ReturnOrderDetailId,
                                ReturnOrderId = d.ReturnOrderId,
                                GoodsId = d.GoodsId,
                                GoodsCode = d.Goods.GoodsCode,
                                Reason = d.Reason,
                                Quantity = d.Quantity,
                                BatchCode = d.BatchCode
                            }).ToList()
                    })
                    .ToList();

                var totalPages = (int)Math.Ceiling((double)count / pageSize);

                return new ReturnOrderFilterPaging
                {
                    Data = returnOrders,
                    PageSize = pageSize,
                    TotalPages = totalPages
                };
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public UpdateReturnOrderResponse UpdateOrder(UpdateReturnOrderRequest request)
        {
            try
            {
                // Tìm đối tượng ReturnOrder hiện có trong cơ sở dữ liệu dựa trên ReturnOrderId
                var returnOrder = _context.ReturnsOrders.Find(request.ReturnOrderId);

                if (returnOrder == null)
                {
                    return new UpdateReturnOrderResponse
                    {
                        IsSuccess = false,
                        Message = "Return order not found"
                    };
                }

                // Cập nhật các thuộc tính của đối tượng ReturnOrder
                returnOrder.ReturnOrderCode = request.ReturnOrderCode;
                returnOrder.ReturnedDate = request.ReturnedDate;
                returnOrder.WarehouseId = request.WarehouseId;
                returnOrder.SupplierId = request.SupplierId;
                returnOrder.StatusId = request.StatusId;
                returnOrder.ApprovedBy = request.ApprovedBy;
                returnOrder.ConfirmedDate = returnOrder.ConfirmedDate; // Cập nhật trường ConfirmedDate

                // Lưu thay đổi vào cơ sở dữ liệu
                _context.Update(returnOrder);
                _context.SaveChanges();

                return new UpdateReturnOrderResponse
                {
                    IsSuccess = true,
                    Message = "Update return order successfully"
                };
            }
            catch (Exception e)
            {
                return new UpdateReturnOrderResponse
                {
                    IsSuccess = false,
                    Message = $"Failed to update return order: {e.Message}"
                };
            }
        }

    }
}