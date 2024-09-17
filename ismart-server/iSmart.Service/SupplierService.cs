using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using iSmart.Entity.DTOs.SupplierDTO;
using iSmart.Entity.Models;
using Microsoft.EntityFrameworkCore;

namespace iSmart.Service
{
    public interface ISupplierService
    {
        SupplierFilterPaging GetSupplierByKeyword(int page, int? statusId, string? keyword = ""); 
        Task<List<SupplierDTO>?> GetAllSupplier();
        Task<List<SupplierDTO>?> GetInternalWarehouses();
        Task<List<SupplierDTO>?> GetAllActiveSupplier();
        Supplier? GetSupplierById(int id);
        CreateSupplierResponse AddSupplier(CreateSupplierRequest supplier, bool isWarehouse);
        UpdateSupplierResponse UpdateSupplier(UpdateSupplierRequest supplier);
        bool UpdateDeleteStatusSupplier(int id);
    }

    public class SupplierService : ISupplierService
    {
        private readonly iSmartContext _context;

        public SupplierService(iSmartContext context)
        {
            _context = context;
        }
        public CreateSupplierResponse AddSupplier(CreateSupplierRequest supplier, bool isWarehouse)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(supplier.SupplierName))
                {
                    return new CreateSupplierResponse { IsSuccess = false, Message = "Tên nhà cung cấp không được để trống hoặc là khoảng trắng!" };
                }

                if (_context.Suppliers.Any(s => s.SupplierName.ToLower() == supplier.SupplierName.ToLower()))
                {
                    return new CreateSupplierResponse { IsSuccess = false, Message = "Tên nhà cung cấp đã tồn tại!" };
                }

                
                var newSupplier = isWarehouse == true ? new Supplier
                {
                    SupplierName = supplier.SupplierName,
                    SupplierPhone = supplier.SupplierPhone,
                    StatusId = supplier.StatusId,
                    SupplierEmail = supplier.SupplierEmail,
                    Note = "Kho nội bộ",
                } : new Supplier
                {
                    SupplierName = supplier.SupplierName,
                    SupplierPhone = supplier.SupplierPhone,
                    StatusId = supplier.StatusId,
                    SupplierEmail = supplier.SupplierEmail,
                    Note = supplier.Note,
                };

                _context.Suppliers.Add(newSupplier);
                _context.SaveChanges();

                return new CreateSupplierResponse { IsSuccess = true, Message = "Thêm nhà cung cấp thành công" };
            }
            catch (Exception ex)
            {
                return new CreateSupplierResponse { IsSuccess = false, Message = "Thêm nhà cung cấp thất bại" };
            }
        }


        public async Task<List<SupplierDTO>?> GetAllSupplier()
        {
            try
            {
                var suppliers = await _context.Suppliers.Include(s => s.Status)
                    .Select(s => new SupplierDTO
                    {
                        SupplierId = s.SupplierId,
                        SupplierName = s.SupplierName,
                        SupplierEmail = s.SupplierEmail,
                        SupplierPhone = s.SupplierPhone,
                        Status = s.Status.StatusType
                    })

                    .ToListAsync();
                return suppliers;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        
        public async Task<List<SupplierDTO>?> GetAllActiveSupplier()
        {
            try
            {
                var suppliers = await _context.Suppliers.Include(s => s.Status).Where(s=> s.StatusId == 1)
                    .Select(s => new SupplierDTO
                    {
                        SupplierId = s.SupplierId,
                        SupplierName = s.SupplierName,
                        SupplierEmail = s.SupplierEmail,
                        SupplierPhone = s.SupplierPhone,
                        StatusId = 1,
                        Status = s.Status.StatusType
                    })

                    .ToListAsync();
                return suppliers;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public Supplier? GetSupplierById(int id)
        {
            try
            {
                return _context.Suppliers.FirstOrDefault(s => s.SupplierId == id);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching the supplier.", ex);
            }
        }

        public SupplierFilterPaging? GetSupplierByKeyword(int page, int? statusId, string? keyword = "")
        {
            try
            {
                var pageSize = 12;
                var suppliersQuery = _context.Suppliers.Include(s => s.Status).AsQueryable();

                if (statusId.HasValue)
                {
                    suppliersQuery = suppliersQuery.Where(s => s.Status.StatusId == statusId.Value);
                }

                // Lấy dữ liệu từ cơ sở dữ liệu vào bộ nhớ
                var suppliers = suppliersQuery.ToList();

                if (!string.IsNullOrEmpty(keyword))
                {
                    var keywords = keyword.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    suppliers = suppliers.Where(s =>
                        keywords.Any(k => s.SupplierName.ToLower().Contains(k) ||
                                          s.SupplierPhone.ToLower().Contains(k) ||
                                          s.SupplierEmail.ToLower().Contains(k))
                    ).ToList();
                }

                var count = suppliers.Count();
                var res = suppliers.Skip((page - 1) * pageSize).Take(pageSize).Select(s => new SupplierDTO
                {
                    SupplierId = s.SupplierId,
                    SupplierName = s.SupplierName,
                    SupplierEmail = s.SupplierEmail,
                    SupplierPhone = s.SupplierPhone,
                    StatusId = s.StatusId,
                    Status = s.Status.StatusType,
                    Note = s.Note
                }).ToList();

                var totalPages = Math.Ceiling((double)count / pageSize);
                return new SupplierFilterPaging { TotalPages = (int)totalPages, PageSize = pageSize, Data = res };
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<List<SupplierDTO>?> GetInternalWarehouses()
        {
            try
            {
                // Truy vấn danh sách nhà cung cấp có Note là "Kho nội bộ"
                var internalWarehouses = await _context.Suppliers
                    .Where(s => s.Note == "Kho nội bộ")
                    .Select(s => new SupplierDTO
                    {
                        SupplierId = s.SupplierId,
                        SupplierName = s.SupplierName,
                        SupplierEmail = s.SupplierEmail,
                        SupplierPhone = s.SupplierPhone,
                        StatusId = s.StatusId,
                        Status = s.Status.StatusType,
                        Note = s.Note
                    })
                    .ToListAsync();

                return internalWarehouses;
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi khi lấy danh sách kho nội bộ: " + ex.Message);
            }
        }





        public bool UpdateDeleteStatusSupplier(int id)
        {
            try
            {
                var supplier = GetSupplierById(id);
                if (supplier == null)
                {
                    return false;
                }

                supplier.StatusId = supplier.StatusId == 1 ? 2 : 1;

                _context.Suppliers.Update(supplier); 
                _context.SaveChanges();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public UpdateSupplierResponse UpdateSupplier(UpdateSupplierRequest supplier)
        {
            try
            {
                // Kiểm tra nếu SupplierName là null hoặc là một chuỗi khoảng trắng
                if (string.IsNullOrWhiteSpace(supplier.SupplierName))
                {
                    return new UpdateSupplierResponse { IsSuccess = false, Message = "Tên nhà cung cấp không được để trống hoặc là khoảng trắng!" };
                }

                var existingSupplier = _context.Suppliers.SingleOrDefault(s => s.SupplierId == supplier.SupplierId);

                if (existingSupplier == null)
                {
                    return new UpdateSupplierResponse { IsSuccess = false, Message = "Nhà cung cấp không tồn tại!" };
                }

                // Kiểm tra nếu SupplierName đã tồn tại (trừ nhà cung cấp hiện tại)
                var duplicateSupplier = _context.Suppliers
                    .SingleOrDefault(s => s.SupplierName.ToLower() == supplier.SupplierName.ToLower() && s.SupplierId != supplier.SupplierId);

                if (duplicateSupplier != null)
                {
                    return new UpdateSupplierResponse { IsSuccess = false, Message = "Tên nhà cung cấp đã tồn tại!" };
                }

                existingSupplier.SupplierName = supplier.SupplierName;
                existingSupplier.SupplierPhone = supplier.SupplierPhone;
                existingSupplier.StatusId = supplier.StatusId;
                existingSupplier.SupplierEmail = supplier.SupplierEmail;
                existingSupplier.Note = supplier.Note;

                _context.Suppliers.Update(existingSupplier);
                _context.SaveChanges();

                return new UpdateSupplierResponse { IsSuccess = true, Message = "Cập nhật nhà cung cấp thành công" };
            }
            catch (Exception e)
            {
                return new UpdateSupplierResponse { IsSuccess = false, Message = "Cập nhật nhà cung cấp thất bại" };
            }
        }



    }
}
