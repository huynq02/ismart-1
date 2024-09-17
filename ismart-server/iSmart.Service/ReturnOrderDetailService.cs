using System;
using System.Collections.Generic;
using System.Linq;
using iSmart.Entity.DTOs.ReturnOrderDetailDTO;
using iSmart.Entity.DTOs.ReturnOrderDTO;
using iSmart.Entity.Models;

namespace iSmart.Service
{
    public interface IReturnOrderDetailService
    {
        List<ReturnsOrderDetail> GetAllReturnOrderDetails();
        CreateReturnOrderDetailResponse AddOrderDetail(CreateReturnOrderDetailRequest detail);
        UpdateReturnOrderDetailResponse UpdateOrderDetail(UpdateReturnOrderDetailRequest detail);
        bool DeleteReturnOrderDetail(int id);
        List<ReturnOrderDetailDTO> GetOrderDetailsByOrderID(int orderId);
    }

    public class ReturnOrderDetailService : IReturnOrderDetailService
    {
        private readonly iSmartContext _context;
        private readonly IReturnOrderService _orderService;

        public ReturnOrderDetailService(iSmartContext context, IReturnOrderService orderService)
        {
            _context = context;
            _orderService = orderService;
        }

        public CreateReturnOrderDetailResponse AddOrderDetail(CreateReturnOrderDetailRequest detail)
        {
            try
            {
                var requestOrderDetail = new ReturnsOrderDetail
                {
                    ReturnOrderId = detail.ReturnOrderId,
                    GoodsId = detail.GoodsId,
                    Quantity = detail.Quantity,
                    Reason = detail.Reason,
                    BatchCode = detail.BatchCode
                };
                _context.ReturnsOrderDetails.Add(requestOrderDetail);
                _context.SaveChanges();
                return new CreateReturnOrderDetailResponse { IsSuccess = true, Message = "Add return order detail complete" };
            }
            catch (Exception e)
            {
                return new CreateReturnOrderDetailResponse { IsSuccess = false, Message = $"Add return order detail failed {e.Message}" };
            }
        }

        public bool DeleteReturnOrderDetail(int id)
        {
            try
            {
                var orderDetail = _context.ReturnsOrderDetails.SingleOrDefault(x => x.ReturnOrderDetailId == id);
                if (orderDetail != null)
                {
                    _context.ReturnsOrderDetails.Remove(orderDetail);
                    _context.SaveChanges();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to delete return order detail: {ex.Message}");
            }
        }

        public List<ReturnsOrderDetail> GetAllReturnOrderDetails()
        {
            try
            {
                var details = _context.ReturnsOrderDetails.ToList();
                return details;
            }
            catch (Exception e)
            {
                throw new Exception($"Failed to retrieve return order details: {e.Message}");
            }
        }

        public List<ReturnOrderDetailDTO> GetOrderDetailsByOrderID(int orderId)
        {
            try
            {
                var details = _context.ReturnsOrderDetails
                    .Where(i => i.ReturnOrderId == orderId)
                    .Select(i => new ReturnOrderDetailDTO
                    {
                        ReturnOrderDetailId = i.ReturnOrderDetailId,
                        ReturnOrderId = i.ReturnOrderId,
                        GoodsId = i.GoodsId,
                        GoodsCode = i.Goods.GoodsCode,
                        Quantity = i.Quantity,
                        Reason = i.Reason,
                        BatchCode = i.BatchCode
                    })
                    .ToList();

                return details;
            }
            catch (Exception e)
            {
                throw new Exception($"Failed to retrieve return order details for order ID {orderId}: {e.Message}");
            }
        }

        public UpdateReturnOrderDetailResponse UpdateOrderDetail(UpdateReturnOrderDetailRequest detail)
        {
            try
            {
                // Tìm đối tượng ReturnsOrderDetail hiện có trong cơ sở dữ liệu dựa trên ReturnOrderDetailId
                var existingDetail = _context.ReturnsOrderDetails.Find(detail.ReturnOrderDetailId);

                if (existingDetail == null)
                {
                    return new UpdateReturnOrderDetailResponse
                    {
                        IsSuccess = false,
                        Message = "Return order detail not found"
                    };
                }

                // Cập nhật các thuộc tính của đối tượng ReturnsOrderDetail
                existingDetail.ReturnOrderId = detail.ReturnOrderId;
                existingDetail.GoodsId = detail.GoodsId;
                existingDetail.Quantity = detail.Quantity;
                existingDetail.Reason = detail.Reason;
                existingDetail.BatchCode = detail.BatchCode;

                // Lưu thay đổi vào cơ sở dữ liệu
                _context.Update(existingDetail);
                _context.SaveChanges();

                return new UpdateReturnOrderDetailResponse
                {
                    IsSuccess = true,
                    Message = "Update return order detail complete"
                };
            }
            catch (Exception e)
            {
                return new UpdateReturnOrderDetailResponse
                {
                    IsSuccess = false,
                    Message = $"Update return order detail failed: {e.Message}"
                };
            }
        }

    }
}
