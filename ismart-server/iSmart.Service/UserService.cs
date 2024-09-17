using iSmart.Entity.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iSmart.Entity.DTOs.UserDTO;
using iSmart.Shared.Helpers;


namespace iSmart.Service
{
    public interface IUserService
    {
        UserFilterPagingResponse GetUsersByKeyword(int pageNum, int? role, int? warehouseId, int? statusId, string? keyword = "");
        List<UserDTO>? GetAllUser();
        UserDTO? GetUserById(int id);
        CreateUserResponse AddUser(CreateUserRequest user, int warehouseId);
        UpdateUserResponse UpdateUser(UpdateUserDTO user);
        bool UpdateDeleteStatusUser(int id);

        List<Role> GetAllRole();
    }
    public class UserService : IUserService
    {
        private readonly iSmartContext _context;
        public IConfiguration _configuration;


        public UserService(iSmartContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        List<UserDTO> userDTOs = new List<UserDTO>();
        public CreateUserResponse AddUser(CreateUserRequest user, int warehouseId)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var password = string.Empty;
                    if (user.Password is not null)
                    {
                        password = HashHelper.Encrypt(user.Password, _configuration);
                    }

                    var userCode = GenerateUserCode(user.RoleId);

                    var requestUser = new User
                    {
                        UserName = user.UserName,
                        UserCode = userCode,
                        FullName = user.FullName,
                        Email = user.Email,
                        Address = user.Address,
                        Phone = user.Phone,
                        RoleId = user.RoleId,
                        Password = password,
                        StatusId = 1,
                        Image = user.Image,
                        //Status = _context.Statuses.FirstOrDefault(s => s.StatusId == user.StatusId)
                    };

                    if (_context.Users.Any(u => u.UserName.ToLower() == user.UserName.ToLower()) || _context.Users.Any(u => u.UserCode.ToLower() == userCode.ToLower()))
                    {
                        return new CreateUserResponse { IsSuccess = false, Message = "User existed" };
                    }

                    _context.Users.Add(requestUser);
                    _context.SaveChanges();

                    var userId = requestUser.UserId; // Lấy UserId của người dùng mới thêm vào

                    // Thêm người dùng vào kho hàng
                    var userWarehouse = new UserWarehouse
                    {
                        UserId = userId,
                        WarehouseId = warehouseId
                    };
                    _context.UserWarehouses.Add(userWarehouse);
                    _context.SaveChanges();

                    transaction.Commit();
                    return new CreateUserResponse { IsSuccess = true, Message = "Add user complete" };
                }
                catch (Exception e)
                {
                    transaction.Rollback();
                    return new CreateUserResponse { IsSuccess = false, Message = $"Add user failed {e.Message}" };
                }
            }
        }

        private string GenerateUserCode(int roleId)
        {
            string prefix = roleId switch
            {
                1 => "ADM",  
                2 => "WHM",  
                3 => "STF", 
                4 => "ACC"   
            };

            var lastUserCode = _context.Users
                                       .Where(u => u.RoleId == roleId)
                                       .OrderByDescending(u => u.UserId)
                                       .Select(u => u.UserCode)
                                       .FirstOrDefault();

            int nextNumber = 1;
            if (!string.IsNullOrEmpty(lastUserCode))
            {
                string numberPart = lastUserCode.Substring(prefix.Length);
                if (int.TryParse(numberPart, out int lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            return $"{prefix}{nextNumber:D4}";
        }
        public List<UserDTO>? GetAllUser()
        {
            try
            {
                var users = _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.Status)
                    .Include(u => u.UserWarehouses)
                    .Select(u => new UserDTO
                    {
                        UserId = u.UserId,
                        UserCode = u.UserCode,
                        UserName = u.UserName,
                        FullName = u.FullName,
                        Email = u.Email,
                        Address = u.Address,
                        Phone = u.Phone,
                        RoleId = u.RoleId,
                        RoleName = u.Role.RoleName,
                        StatusId = u.StatusId,
                        StatusName = u.Status.StatusType,
                        Image = u.Image,
                        //WarehouseNames = u.UserWarehouses.Select(uw => uw.Warehouse.WarehouseName).ToList()
                    })
                    .ToList();

                return users;
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while getting all users.", ex);
            }
        }


        public UserDTO? GetUserById(int id)
        {
            try
            {
                var user = _context.Users
                    .Include(u => u.Role)
                    .Include(u => u.Status)
                    .FirstOrDefault(a => a.UserId == id);

                if (user != null)
                {
                    var u = new UserDTO
                    {
                        UserId = user.UserId,
                        UserName = user.UserName,
                        UserCode = user.UserCode,
                        FullName = user.FullName,
                        Email = user.Email,
                        Address = user.Address,
                        Phone = user.Phone,
                        RoleId = user.RoleId,
                        RoleName = user.Role.RoleName,
                        StatusId = user.StatusId,
                        StatusName = user.Status.StatusType,
                        Image = user.Image,
                        //WarehouseNames = user.UserWarehouses.Select(uw => uw.Warehouse.WarehouseName).ToList()
                    };

                    return u;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception e)
            {
                throw new Exception("Error occurred while getting user by ID.", e);
            }
        }

        public UserFilterPagingResponse GetUsersByKeyword(int pageNum, int? role, int? warehouseId, int? statusId, string? keyword = "")
        {
            try
            {
                var pageSize = 12;
                if (pageNum <= 0) pageNum = 1;

                var query = _context.Users
                    .Include(u => u.Status)
                    .Include(u => u.Role)
                    .Include(u => u.UserWarehouses)
                        .ThenInclude(uw => uw.Warehouse)
                    .OrderBy(u => u.UserId)
                    .AsQueryable(); // Đảm bảo tạo query có thể mở rộng

                // Lấy dữ liệu từ cơ sở dữ liệu vào bộ nhớ
                var users = query.ToList();

                // Thực hiện tìm kiếm từ khóa trên danh sách trong bộ nhớ
                if (!string.IsNullOrEmpty(keyword))
                {
                    var keywords = keyword.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    users = users.Where(u =>
                        keywords.Any(k =>
                            u.UserCode.ToLower().Contains(k) ||
                            u.UserName.ToLower().Contains(k) ||
                            u.Email.ToLower().Contains(k) ||
                            u.UserWarehouses.Any(uw => uw.Warehouse.WarehouseName.ToLower().Contains(k))
                        )
                    ).ToList();
                }

                // Lọc theo role, statusId và warehouseId
                if (role.HasValue)
                    users = users.Where(u => u.RoleId == role).ToList();
                if (statusId.HasValue)
                    users = users.Where(u => u.StatusId == statusId).ToList();
                if (warehouseId.HasValue)
                    users = users.Where(u => u.UserWarehouses.Any(uw => uw.WarehouseId == warehouseId)).ToList();

                // Thực hiện phân trang và trả về kết quả
                var count = users.Count();
                var totalPages = (int)Math.Ceiling((double)count / pageSize);
                users = users.Skip((pageNum - 1) * pageSize).Take(pageSize).ToList();

                return new UserFilterPagingResponse
                {
                    PageSize = pageSize,
                    TotalPages = totalPages,
                    Data = users.Select(u => new UserDTO
                    {
                        UserId = u.UserId,
                        UserCode = u.UserCode,
                        UserName = u.UserName,
                        FullName = u.FullName,
                        Email = u.Email,
                        Address = u.Address,
                        Phone = u.Phone,
                        RoleId = u.RoleId,
                        RoleName = u.Role.RoleName,
                        StatusId = u.StatusId,
                        StatusName = u.Status.StatusType,
                        Image = u.Image
                    }).ToList()
                };
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }




        public bool UpdateDeleteStatusUser(int id)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(a => a.UserId == id);
                if (user == null)
                {
                    return false;
                }
                else if (user.StatusId == 1)
                {
                    user.StatusId = 2;
                }
                else user.StatusId = 1;
                _context.Update(user);
                _context.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public UpdateUserResponse UpdateUser(UpdateUserDTO user)
        {
            try
            {
                // Kiểm tra xem người dùng có tồn tại không
                var existingUser = _context.Users.FirstOrDefault(u => u.UserId == user.UserId);
                if (existingUser == null)
                {
                    return new UpdateUserResponse { IsSuccess = false, Message = "User not found." };
                }

                existingUser.UserCode = user.UserCode;
                existingUser.UserName = user.UserName;
                existingUser.FullName = user.FullName;
                existingUser.Email = user.Email;
                existingUser.Address = user.Address;
                existingUser.Phone = user.Phone;
                existingUser.RoleId = user.RoleId;
                existingUser.StatusId = user.StatusId;
                existingUser.Image = user.Image;

                _context.SaveChanges();

                return new UpdateUserResponse { IsSuccess = true, Message = "Update account complete." };
            }
            catch (Exception e)
            {
                return new UpdateUserResponse { IsSuccess = false, Message = "Update account failed. " + e.Message };
            }
        }

        public List<Role> GetAllRole()
        {
            var roles = _context.Roles.ToList();
            return roles;
        }
    }
}