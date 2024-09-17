using iSmart.Entity.DTOs.UserDTO;
using iSmart.Entity.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Service
{
    public interface IUserWarehouseService
    {
        Task<List<Warehouse>> GetUserWarehousesAsync(int userId);
        Task<List<User>> GetWarehouseUsersAsync(int warehouseId);
        Task AddUserToWarehouseAsync(int userId, int warehouseId);
        Task<bool> RemoveUserFromWarehouseAsync(int userId, int warehouseId);
        Task<int?> GetWarehouseIdByIdAsync(int userId);
        Task<int?> GetWarehouseManagerIdByStaffId(int staffId);
        int? GetManagerIdByStaffId(int staffId);
    }

    public class UserWarehouseService : IUserWarehouseService
    {
        private readonly iSmartContext _context;


        public UserWarehouseService(iSmartContext context)
        {
            _context = context;
        }
        public async Task<int?> GetWarehouseIdByIdAsync(int userId)
        {
            try
            {
                var userWarehouse = await _context.UserWarehouses
                                                  .FirstOrDefaultAsync(uw => uw.UserId == userId);
                return userWarehouse?.WarehouseId;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task AddUserToWarehouseAsync(int userId, int warehouseId)
        {
            try
            {
                // Kiểm tra xem bản ghi đã tồn tại chưa
                bool exists = await _context.UserWarehouses
                                            .AnyAsync(uw => uw.UserId == userId && uw.WarehouseId == warehouseId);
                if (exists)
                {
                    throw new InvalidOperationException("The user is already assigned to this warehouse.");
                }
                // Kiểm tra xem user và warehouse có tồn tại không
                bool userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
                bool warehouseExists = await _context.Warehouses.AnyAsync(w => w.WarehouseId == warehouseId);
                if (!userExists || !warehouseExists)
                {
                    throw new InvalidOperationException("The user or warehouse does not exist.");
                }
                // Thêm bản ghi mới vào UserWarehouse
                var userWarehouse = new UserWarehouse { UserId = userId, WarehouseId = warehouseId };
                _context.UserWarehouses.Add(userWarehouse);
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<List<Warehouse>> GetUserWarehousesAsync(int userId)
            {
                try
                {
                    var warehouseOfUser = await _context.UserWarehouses.Where(uw => uw.UserId == userId).Select(uw => uw.Warehouse).ToListAsync();
                    return warehouseOfUser;
                }
                catch (Exception e)
                {
                    throw new Exception(e.Message);
                }

            }

        public async Task<List<User>> GetWarehouseUsersAsync(int warehouseId)
        {
            try
            {
                return await _context.UserWarehouses
                    .Where(uw => uw.WarehouseId == warehouseId)
                    .Select(uw => uw.User)
                    .ToListAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<bool> RemoveUserFromWarehouseAsync(int userId, int warehouseId)
        {
            try
            {
                var userWarehouse = await _context.UserWarehouses
                                                  .FirstOrDefaultAsync(uw => uw.UserId == userId && uw.WarehouseId == warehouseId);
                if (userWarehouse != null)
                {
                    _context.UserWarehouses.Remove(userWarehouse);
                    await _context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public async Task<int?> GetWarehouseManagerIdByStaffId(int staffId)
        {
            var warehouseIds = await _context.UserWarehouses
                .Where(uw => uw.UserId == staffId)
                .Select(uw => uw.WarehouseId)
                .ToListAsync();

            if (!warehouseIds.Any())
            {
                return null;
            }

            var managerId = await _context.UserWarehouses
            .Where(uw => warehouseIds.Contains(uw.WarehouseId) && uw.User.RoleId == 2)
            .Select(uw => uw.UserId)
            .FirstOrDefaultAsync();

            // Nếu không tìm thấy, tìm quản lý với vai trò 1
            if (managerId == 0)
            {
                managerId = await _context.UserWarehouses
                    .Where(uw => warehouseIds.Contains(uw.WarehouseId) && uw.User.RoleId == 1)
                    .Select(uw => uw.UserId)
                    .FirstOrDefaultAsync();
            }

            return managerId != 0 ? managerId : (int?)null;
        }

        public int? GetManagerIdByStaffId(int staffId)
        {
            var warehouseIds = _context.UserWarehouses
                .Where(uw => uw.UserId == staffId)
                .Select(uw => uw.WarehouseId)
                .ToList();

            if (!warehouseIds.Any())
            {
                return null;
            }

            var managerId =  _context.UserWarehouses
                .Where(uw => warehouseIds.Contains(uw.WarehouseId) && uw.User.RoleId == 2)
                .Select(uw => uw.UserId)
                .FirstOrDefault();

            return managerId != 0 ? managerId : (int?)null;
        }

    }
}
