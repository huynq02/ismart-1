using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using iSmart.Entity.DTOs;
using iSmart.Service;
using iSmart.Entity.DTOs.UserDTO;
using iSmart.Shared.Helpers;


namespace iSmart.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    //[Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("get-all-role")]
        public IActionResult GetAllRole()
        {
            var result = _userService.GetAllRole();
            return Ok(result);
        }

        //[AllowAnonymous]
        [HttpGet("get-all-user")]
        public IActionResult GetAllUser()
        {
            var result = _userService.GetAllUser();
            return Ok(result);
        }

        [HttpGet("get-users")]
        public IActionResult GetUserByKeyword(int pageNum, int? role, int? warehouseId, int? statusId, string? keyword = "") 
        {
            var result = _userService.GetUsersByKeyword(pageNum,role, warehouseId, statusId, keyword);
            return Ok(result);
        }

        // GET api/<UserController>/5
        [HttpGet("get-user-by-id")]
        public IActionResult GetUserById(int id)
        {
            var result  = _userService.GetUserById(id);
            if(result == null)
            {
                return NotFound("Khong co ket qua");

            }
            else
                    return Ok(result);
        }

        // POST api/<UserController>
        [HttpPost("add-user")]
        public IActionResult AddUser(CreateUserRequest user, int warehouseId)
        {
            var username = user.UserName;
            user.Password = TokenHelper.GenerateNumericToken(8);
            var password = user.Password;
            var result = _userService.AddUser(user, warehouseId);
            if (result != null && result.IsSuccess)
            {
                MailMessage mm = new MailMessage("wmsystemsp24@gmail.com", user.Email);
                mm.Subject = "Chào mừng đến với hệ thống WMS";
                mm.Body = "Tài khoản đằng nhập của bạn" + "<br>" +
                          "Tài khoản của bạn: " + username + "<br>" +
                          "Mật khẩu của bạn: " + password + "<br>" +
                          "Làm ơn không đưa người khác email này";
                mm.IsBodyHtml = true;

                SmtpClient smtp = new SmtpClient();
                smtp.Host = "smtp.gmail.com";
                smtp.EnableSsl = true;
                NetworkCredential NetworkCred = new NetworkCredential();
                NetworkCred.UserName = "wmsystemsp24@gmail.com";
                NetworkCred.Password = "jxpd wccm kits gona";
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = NetworkCred;
                smtp.Port = 587;
                smtp.Send(mm);
            }
            return Ok(result);
        }

        // PUT api/<UserController>/5
        [HttpPut("update-user")]
        public IActionResult UpdateUser(UpdateUserDTO user)
        {
            var result = _userService.UpdateUser(user);
            return Ok(result);
        }

        
        [HttpPut("update-user-status")]
        public async Task<IActionResult> UpdateStatus(int id)
        {
            var user = _userService.UpdateDeleteStatusUser(id);
            return Ok(user);
        }
    }
}
