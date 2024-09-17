using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.DTOs.DeliveryDTO;
using iSmart.Entity.Models;
using Microsoft.AspNetCore.Mvc;

namespace iSmart.Service
{
    public interface IDeliveryService
    {
        DeliveryFilterPaging GetDeliveryByKeyWord(int page, string? keyword = "");
        List<Delivery> GetAllDelivery();
        List<Delivery> GetAllActiveDelivery();
        Delivery GetDeliveryById(int id);
        CreateDeliveryResponse AddDelivery(CreateDeliveryRequest delivery);
        UpdateDeliveryResponse UpdateDelivery(UpdateDeliveryRequest delivery);

        bool UpdateDeleteStatusDelivery(int id);

    }
    public class DeliveryService : IDeliveryService
    {
        private readonly iSmartContext _context;

        public DeliveryService(iSmartContext context)
        {
            _context = context;
        }


        public bool UpdateDeleteStatusDelivery(int id)
        {
            try
            {
                var delivery = GetDeliveryById(id);
                if (delivery == null)
                {
                    return false;
                }

                delivery.StatusId = delivery.StatusId == 1 ? 2 : 1;

                _context.Deliveries.Update(delivery);
                _context.SaveChanges();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public CreateDeliveryResponse AddDelivery(CreateDeliveryRequest delivery)
        {
            try
            {
                // Kiểm tra nếu DeliveryName là null hoặc là một chuỗi khoảng trắng
                if (string.IsNullOrWhiteSpace(delivery.DeliveryName))
                {
                    return new CreateDeliveryResponse { IsSuccess = false, Message = "Tên delivery không được để trống hoặc là khoảng trắng!" };
                }

                var requestDelivery = new Delivery
                {
                    DeliveryName = delivery.DeliveryName,
                    StatusId = 1,               
                };

                // Kiểm tra nếu DeliveryName đã tồn tại trong cơ sở dữ liệu
                if (_context.Deliveries.Any(d => d.DeliveryName.ToLower() == requestDelivery.DeliveryName.ToLower()))
                {
                    return new CreateDeliveryResponse { IsSuccess = false, Message = "Tên delivery đã tồn tại!" };
                }

                _context.Deliveries.Add(requestDelivery);
                _context.SaveChanges();
                return new CreateDeliveryResponse { IsSuccess = true, Message = "Thêm delivery thành công" };
            }
            catch (Exception ex)
            {
                return new CreateDeliveryResponse { IsSuccess = false, Message = "Thêm delivery thất bại" };
            }
        }


        public List<Delivery> GetAllDelivery()
        {
            try
            {
                var deliveries = _context.Deliveries.ToList();
                return deliveries;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public List<Delivery> GetAllActiveDelivery()
        {
            try
            {
                var deliveries = _context.Deliveries.Where(d => d.StatusId == 1).ToList();
                return deliveries;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public Delivery GetDeliveryById(int id)
        {
            try
            {
                var deliveries = _context.Deliveries.FirstOrDefault(d => d.DeliveyId == id);
                return deliveries ?? null;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public DeliveryFilterPaging GetDeliveryByKeyWord(int page, string? keyword = "")
        {
            try
            {
                var pageSize = 12;
                List<Delivery> deliveries;

                // Kiểm tra nếu keyword là null hoặc là một chuỗi khoảng trắng
                if (string.IsNullOrWhiteSpace(keyword))
                {
                    // Nếu keyword là null hoặc là một chuỗi khoảng trắng, lấy tất cả các delivery
                    deliveries = _context.Deliveries
                                         .OrderBy(d => d.DeliveyId)
                                         .ToList();
                }
                else
                {
                    // Nếu keyword không phải là null hoặc chuỗi khoảng trắng, thực hiện lọc theo keyword
                    deliveries = _context.Deliveries
                                         .Where(d => d.DeliveryName.ToLower().Contains(keyword.ToLower()))
                                         .OrderBy(d => d.DeliveyId)
                                         .ToList();
                }
                var count = deliveries.Count();
                var res = deliveries.Skip((page - 1) * pageSize).Take(pageSize).ToList();
                var totalPages = Math.Ceiling((double)count / pageSize);

                return new DeliveryFilterPaging
                {
                    TotalPages = (int)totalPages,
                    PageSize = pageSize,
                    Data = res
                };
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }





        public UpdateDeliveryResponse UpdateDelivery(UpdateDeliveryRequest delivery)
        {
            try
            {
                // Kiểm tra nếu DeliveryName là null hoặc là một chuỗi khoảng trắng
                if (string.IsNullOrWhiteSpace(delivery.DeliveryName))
                {
                    return new UpdateDeliveryResponse { IsSuccess = false, Message = "Tên delivery không được để trống hoặc là khoảng trắng!" };
                }

                var existingDelivery = _context.Deliveries.SingleOrDefault(d => d.DeliveyId == delivery.DeliveryId);

                if (existingDelivery == null)
                {
                    return new UpdateDeliveryResponse { IsSuccess = false, Message = "Delivery không tồn tại!" };
                }

                // Kiểm tra nếu DeliveryName đã tồn tại (trừ delivery hiện tại)
                var duplicateDelivery = _context.Deliveries
                    .SingleOrDefault(d => d.DeliveryName.ToLower() == delivery.DeliveryName.ToLower() && d.DeliveyId != delivery.DeliveryId);

                if (duplicateDelivery != null)
                {
                    return new UpdateDeliveryResponse { IsSuccess = false, Message = "Tên delivery đã tồn tại!" };
                }

                existingDelivery.DeliveryName = delivery.DeliveryName;

                _context.Deliveries.Update(existingDelivery);
                _context.SaveChanges();

                return new UpdateDeliveryResponse { IsSuccess = true, Message = "Cập nhật delivery thành công" };
            }
            catch (Exception e)
            {
                return new UpdateDeliveryResponse { IsSuccess = false, Message = "Cập nhật delivery thất bại" };
            }
        }



    }
}
