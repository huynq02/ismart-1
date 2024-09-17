using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.DTOs.ExportOrderDetailDTO;
using iSmart.Entity.DTOs.ExportOrderDTO;
using iSmart.Entity.Models;
using Microsoft.EntityFrameworkCore;

namespace iSmart.Service
{
    public interface IExportOrderDetailService
    {
        List<ExportOrderDetail> GetAllExportOrderDetails();
        CreateExportOrderDetailResponse AddOrderDetail(CreateExportOrderDetailRequest detail);
        UpdateExportOrderDetailResponse UpdateOrderDetail(UpdateExportOrderDetailRequest detail);
        bool DeleteExportOrderDetail(int id);
        List<ExportDetailDTO> GetOrderDetailsByOrderID(int oid);
    }
    public class ExportOrderDetailService : IExportOrderDetailService
    {
        private readonly iSmartContext _context;
        private readonly IExportOrderService _orderService;

        public ExportOrderDetailService(iSmartContext context, IExportOrderService orderService)
        {
            _context = context;
            _orderService = orderService;
        }
        public CreateExportOrderDetailResponse AddOrderDetail(CreateExportOrderDetailRequest detail)
        {
            try
            {
                var requestOrder = new ExportOrderDetail
                {
                    ExportId = detail.ExportId,
                    GoodsId = detail.GoodsId,
                    Quantity = detail.Quantity,
                    Price = detail.Price,
                    ImportOrderDetailId = detail.ImportOrderDetailId
                };
                _context.ExportOrderDetails.Add(requestOrder);
                _context.SaveChanges();
                return new CreateExportOrderDetailResponse { IsSuccess = true, Message = "Add order detail complete" };
            }
            catch (Exception e)
            {
                return new CreateExportOrderDetailResponse { IsSuccess = false, Message = $"Add order detail failed {e.Message}" };

            }
        }

        public bool DeleteExportOrderDetail(int id)
        {
            try
            {
                var order = _context.ExportOrderDetails.SingleOrDefault(x => x.DetailId == id);
                _context.ExportOrderDetails.Remove(order);
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public List<ExportOrderDetail> GetAllExportOrderDetails()
        {
            try
            {
                var details = _context.ExportOrderDetails.ToList();
                return details;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }


        public List<ExportDetailDTO> GetOrderDetailsByOrderID(int oid)
        {
            try
            {
                var details = _context.ExportOrderDetails.Include(e => e.ImportOrderDetail).Where(i => i.ExportId == oid)
                    .Select( i => new ExportDetailDTO
                {
                        DetailId = i.DetailId,
                        ExportId = i.ExportId,
                        GoodsId = i.GoodsId,
                        Price = i.Price,
                        Quantity = i.Quantity,
                        GoodsCode = i.Goods.GoodsCode,
                        ImportOrderDetailId = i.ImportOrderDetailId,
                        batchCode = i.ImportOrderDetail.BatchCode
                    })      
                     .ToList();
                return details;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }


        public UpdateExportOrderDetailResponse UpdateOrderDetail(UpdateExportOrderDetailRequest detail)
        {
            try
            {
                // Tìm đối tượng ExportOrderDetail hiện có trong cơ sở dữ liệu dựa trên DetailId
                var existingDetail = _context.ExportOrderDetails.Find(detail.DetailId);

                if (existingDetail == null)
                {
                    return new UpdateExportOrderDetailResponse
                    {
                        IsSuccess = false,
                        Message = "Order detail not found"
                    };
                }

                // Cập nhật các thuộc tính của đối tượng ExportOrderDetail
                existingDetail.ExportId = detail.ExportId;
                existingDetail.GoodsId = detail.GoodsId;
                existingDetail.Quantity = detail.Quantity;
                existingDetail.Price = detail.Price;
                existingDetail.ImportOrderDetailId = detail.ImportOrderDetailId;

                // Lưu thay đổi vào cơ sở dữ liệu
                _context.Update(existingDetail);
                _context.SaveChanges();

                return new UpdateExportOrderDetailResponse
                {
                    IsSuccess = true,
                    Message = "Update order detail complete"
                };
            }
            catch (Exception e)
            {
                return new UpdateExportOrderDetailResponse
                {
                    IsSuccess = false,
                    Message = $"Update order detail failed: {e.Message}"
                };
            }
        }

    }
}

