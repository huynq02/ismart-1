using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.UserDTO
{
    public class UserRequest
    {
        public int UserId { get; set; }

        public string? Email { get; set; }

        public string Password { get; set; } = null!;

        public string? Phone { get; set; }

        public int RoleId { get; set; }

        public int StatusId { get; set; }

        public string? UserName { get; set; }

        public string? UserCode { get; set; }

        public string? Address { get; set; } = null;

        public string? Image { get; set; } = null;

        public string? FullName { get; set; } = null;
    }
}
