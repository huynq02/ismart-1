using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.DTOs;
using iSmart.Entity.DTOs.WarehouseDTO;
using iSmart.Entity.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace iSmart.Service
{
    public interface IWarehouseService
    {
        WarehouseFilterPaging GetStoragesByKeyword(int page, string? keyword = "");
        List<Warehouse>? GetAllStorage();
        CreateWarehouseResponse AddStorage(CreateWarehouseRequest storage);
        UpdateWarehouseResponse UpdateStorage(UpdateWarehouseRequest storage);
    }
    public class WarehouseService : IWarehouseService
    {
        private readonly iSmartContext _context;

        public WarehouseService(iSmartContext context)
        {
            _context = context;
        }

        public List<Warehouse>? GetAllStorage()
        {
            try
            {
                var storages = _context.Warehouses.ToList();
                return storages;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }


        public WarehouseFilterPaging? GetStoragesByKeyword(int page, string? keyword = "")
        {
            try
            {
                var pageSize = 12;
                var storagesQuery = _context.Warehouses.AsQueryable();

                // Lấy dữ liệu từ cơ sở dữ liệu vào bộ nhớ
                var storages = storagesQuery.ToList();

                if (!string.IsNullOrEmpty(keyword))
                {
                    var keywords = keyword.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    storages = storages.Where(s =>
                        keywords.Any(k => s.WarehouseName.ToLower().Contains(k) ||
                                          s.WarehouseAddress.ToLower().Contains(k))
                    ).ToList();
                }

                var count = storages.Count();
                var res = storages.Skip((page - 1) * pageSize).Take(pageSize).ToList();
                var totalPages = Math.Ceiling((double)count / pageSize);
                return new WarehouseFilterPaging { TotalPages = (int)totalPages, PageSize = pageSize, Data = res };
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }


        public CreateWarehouseResponse AddStorage(CreateWarehouseRequest storage)
        {
            try
            {
                var requestStorage = new Warehouse
                {
                    WarehouseName = storage.StorageName,
                    WarehouseAddress = storage.StorageAddress,
                    WarehousePhone = storage.StoragePhone
                };
                _context.Warehouses.Add(requestStorage);
                _context.SaveChanges();
                return new CreateWarehouseResponse { IsSuccess = true, Message = $"Thêm kho hàng thành công" };
            }
            catch (Exception ex)
            {
                return new CreateWarehouseResponse { IsSuccess = false, Message = $"Thêm kho hàng thất bại" };
            }
        }

        public UpdateWarehouseResponse UpdateStorage(UpdateWarehouseRequest storage)
        {
            try
            {
                var requestStorage = new Warehouse
                {
                    WarehouseId = storage.StorageId,
                    WarehouseName = storage.StorageName,
                    WarehouseAddress = storage.StorageAddress,
                    WarehousePhone = storage.StoragePhone
                };
                _context.Warehouses.Update(requestStorage);
                _context.SaveChanges();
                return new UpdateWarehouseResponse { IsSuccess = true, Message = "Update storage successfully" };

            }
            catch (Exception e)
            {
                return new UpdateWarehouseResponse { IsSuccess = false, Message = "Update storage failed" };
            }
        }
    }
}
