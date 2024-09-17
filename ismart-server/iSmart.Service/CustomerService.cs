using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using iSmart.Entity.DTOs.CustomerDTOs;
using iSmart.Entity.DTOs.ExportOrderDTO;
using iSmart.Entity.Models;
using Microsoft.EntityFrameworkCore;

namespace iSmart.Service
{
    public interface ICustomerService
    {
        CustomerFilterPaging GetCustomerByKeyword(int page, string? keyword = "");
        Task<List<CustomerDTO>?> GetAllCustomers();
        Customer? GetCustomerById(int id);
        CreateCustomerResponse AddCustomer(CreateCustomerRequest customer);
        UpdateCustomerResponse UpdateCustomer(UpdateCustomerRequest customer);
        List<ExportOrderDTO> GetAllHistoryCustomerOrder(int customerId);
    }

    public class CustomerService : ICustomerService
    {
        private readonly iSmartContext _context;

        public CustomerService(iSmartContext context)
        {
            _context = context;
        }

        public CreateCustomerResponse AddCustomer(CreateCustomerRequest customer)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(customer.CustomerName))
                {
                    return new CreateCustomerResponse { IsSuccess = false, Message = "Tên khách hàng không được để trống hoặc là khoảng trắng!" };
                }

                if (_context.Customers.Any(c => c.CustomerName.ToLower() == customer.CustomerName.ToLower()))
                {
                    return new CreateCustomerResponse { IsSuccess = false, Message = "Tên khách hàng đã tồn tại!" };
                }

                var newCustomer = new Customer
                {
                    CustomerName = customer.CustomerName,
                    CustomerPhone = customer.CustomerPhone,
                    CustomerEmail = customer.CustomerEmail,
                    CustomerAddress = customer.CustomerAddress
                };

                _context.Customers.Add(newCustomer);
                _context.SaveChanges();

                return new CreateCustomerResponse { IsSuccess = true, Message = "Thêm khách hàng thành công" };
            }
            catch (Exception ex)
            {
                return new CreateCustomerResponse { IsSuccess = false, Message = "Thêm khách hàng thất bại" };
            }
        }

        public async Task<List<CustomerDTO>?> GetAllCustomers()
        {
            try
            {
                var customers = await _context.Customers
                    .Select(c => new CustomerDTO
                    {
                        CustomerId = c.CustomerId,
                        CustomerName = c.CustomerName,
                        CustomerEmail = c.CustomerEmail,
                        CustomerPhone = c.CustomerPhone,
                        CustomerAddress = c.CustomerAddress
                    })
                    .ToListAsync();
                return customers;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public Customer? GetCustomerById(int id)
        {
            try
            {
                return _context.Customers.FirstOrDefault(c => c.CustomerId == id);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the customer.", ex);
            }
        }

        public CustomerFilterPaging? GetCustomerByKeyword(int page, string? keyword = "")
        {
            try
            {
                var pageSize = 12;

                // Chuyển từ khóa thành chữ thường
                keyword = keyword?.ToLower().Trim();

                // Tạo truy vấn cơ bản
                var customersQuery = _context.Customers.AsQueryable();

                if (!string.IsNullOrEmpty(keyword))
                {
                    customersQuery = customersQuery.Where(c =>
                        c.CustomerName.ToLower().Contains(keyword) ||
                        c.CustomerPhone.ToLower().Contains(keyword) ||
                        c.CustomerEmail.ToLower().Contains(keyword) ||
                        c.CustomerAddress.ToLower().Contains(keyword));
                }

                var customers = customersQuery
                    .OrderBy(c => c.CustomerId)
                    .Select(c => new CustomerDTO
                    {
                        CustomerId = c.CustomerId,
                        CustomerName = c.CustomerName,
                        CustomerEmail = c.CustomerEmail,
                        CustomerPhone = c.CustomerPhone,
                        CustomerAddress = c.CustomerAddress
                    })
                    .ToList();

                var count = customers.Count();
                var res = customers.Skip((page - 1) * pageSize).Take(pageSize).ToList();
                var totalPages = Math.Ceiling((double)count / pageSize);

                return new CustomerFilterPaging { TotalPages = (int)totalPages, PageSize = pageSize, Data = res };
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }



        public UpdateCustomerResponse UpdateCustomer(UpdateCustomerRequest customer)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(customer.CustomerName))
                {
                    return new UpdateCustomerResponse { IsSuccess = false, Message = "Tên khách hàng không được để trống hoặc là khoảng trắng!" };
                }

                var existingCustomer = _context.Customers.SingleOrDefault(c => c.CustomerId == customer.CustomerId);

                if (existingCustomer == null)
                {
                    return new UpdateCustomerResponse { IsSuccess = false, Message = "Khách hàng không tồn tại!" };
                }

                var duplicateCustomer = _context.Customers
                    .SingleOrDefault(c => c.CustomerName.ToLower() == customer.CustomerName.ToLower() && c.CustomerId != customer.CustomerId);

                if (duplicateCustomer != null)
                {
                    return new UpdateCustomerResponse { IsSuccess = false, Message = "Tên khách hàng đã tồn tại!" };
                }

                existingCustomer.CustomerName = customer.CustomerName;
                existingCustomer.CustomerPhone = customer.CustomerPhone;
                existingCustomer.CustomerEmail = customer.CustomerEmail;
                existingCustomer.CustomerAddress = customer.CustomerAddress;

                _context.Customers.Update(existingCustomer);
                _context.SaveChanges();

                return new UpdateCustomerResponse { IsSuccess = true, Message = "Cập nhật khách hàng thành công" };
            }
            catch (Exception e)
            {
                return new UpdateCustomerResponse { IsSuccess = false, Message = "Cập nhật khách hàng thất bại" };
            }
        }

        public List<ExportOrderDTO> GetAllHistoryCustomerOrder(int customerId)
        {
            try
            {
                var exportOrder = _context.ExportOrders.Where(e => e.CustomerId == customerId && e.StatusId == 4)
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
    }
}
