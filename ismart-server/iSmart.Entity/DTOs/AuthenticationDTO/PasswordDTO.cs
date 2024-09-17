using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace iSmart.Entity.DTOs.AuthenticationDTO
{
    public class PasswordDTO
    {
        public int? UserId { get; set; }
        public string Password { get; set; }
        public string? OldPassword { get; set; }
    }
}
