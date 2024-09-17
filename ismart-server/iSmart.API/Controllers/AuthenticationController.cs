using iSmart.Entity.DTOs.AuthenticationDTO;
using iSmart.Entity.Models;
using iSmart.Shared.Constants;
using iSmart.Shared.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Text;
//thu
namespace iSmart.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    

    public class AuthenticationController : ControllerBase
    {
        public IConfiguration _configuration;
        public readonly iSmartContext _context;

        public AuthenticationController(IConfiguration configuration, iSmartContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO model)
        {
            try
            {
                var user = await _context.Users.Include(u => u.UserWarehouses).SingleOrDefaultAsync(u => u.UserName == model.UserName);
                
                if (user != null && HashHelper.Decrypt(user.Password, _configuration) == model.Password && user.StatusId == 1)
                {
                    var tokenModel = GenerateToken(user);
                    return Ok(new
                    {
                        token = tokenModel.AccessToken,
                        refreshToken = tokenModel.RefreshToken,
                        userName = user.UserName,
                        roleId = user.RoleId,
                        userId = user.UserId,
                        warehouseId = user.UserWarehouses.FirstOrDefault()?.WarehouseId

                    });
                }
                else
                {
                    return BadRequest("InvalidCredential");
                }
            }
            catch
            {
                return StatusCode(500);
            }
        }
        private TokenModel GenerateToken(User user)
        {
            var access = GenerateAccessToken(user);
            var refresh = TokenHelper.GenerateRandomToken();
            var tokenhandler = new JwtSecurityTokenHandler();
            var token = tokenhandler.ReadJwtToken(access);
            var jwtId = token.Id; // Lấy JwtId từ access token

            var refreshEntity = new RefreshToken
            {
                UserId = user.UserId,
                Token = refresh,
                Created = DateTime.UtcNow,
                JwtId = jwtId, // Lưu JwtId vào refresh token
                ExpiredAt = DateTime.UtcNow.AddMonths(1)
            };

            var exist = _context.RefreshTokens.FirstOrDefault(x => x.UserId == user.UserId);
            if (exist != null)
            {
                exist.Token = refreshEntity.Token;
                exist.JwtId = jwtId; // Cập nhật JwtId cho refresh token đã tồn tại
                _context.RefreshTokens.Update(exist);
            }
            else
            {
                _context.Add(refreshEntity);
            }
            _context.SaveChanges();
            return new TokenModel(access, refresh);
        }


        private string GenerateAccessToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                new Claim("UserId", user.UserId.ToString()),
                new Claim("RoleId", user.RoleId.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(12),
                //expires: DateTime.UtcNow.AddSeconds(60),
                signingCredentials: signIn
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        [HttpPost("refresh-token")]
        public async Task<IActionResult> RenewToken(TokenModel tokenmodel)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var secretKey = _configuration["Jwt:Key"];
            var tokenValidateParameter = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidIssuer = _configuration["Jwt:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ClockSkew = TimeSpan.Zero,
                ValidateLifetime = false
            };

            try
            {
                // Xác thực và phân tích access token
                var tokenInVerification = jwtTokenHandler.ValidateToken(tokenmodel.AccessToken, tokenValidateParameter, out var validatedToken);

                // Kiểm tra thuật toán mã hóa của access token
                if (validatedToken is JwtSecurityToken jwtSecurityToken)
                {
                    var algorithm = jwtSecurityToken.Header.Alg;
                    if (!algorithm.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                    {
                        return BadRequest("Invalid access token algorithm");
                    }
                }

                // Kiểm tra refresh token
                var refresh = await _context.RefreshTokens.SingleOrDefaultAsync(rf => rf.Token == tokenmodel.RefreshToken);
                if (refresh == null)
                {
                    return BadRequest("Refresh token does not exist");
                }
                else if ((bool)refresh.IsRevoked)
                {
                    return BadRequest("Refresh token is revoked");
                }

                // Lấy JwtId từ access token
                var jwtIdClaim = tokenInVerification.FindFirstValue(JwtRegisteredClaimNames.Jti);

                if (refresh.JwtId != jwtIdClaim)
                {
                    return BadRequest("Refresh token does not match the original access token");
                }

                // Lấy thông tin người dùng và trả về access token mới
                int userId = Int32.Parse(tokenInVerification.Claims.FirstOrDefault(x => x.Type == "UserId")?.Value);
                var user = await _context.Users.SingleOrDefaultAsync(a => a.UserId == userId);
                return Ok(GenerateToken(user));
            }
            catch (SecurityTokenValidationException ex)
            {
                return BadRequest($"Invalid token: {ex.Message}");
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout(int id)
        {
            try
            {
                var user = await _context.RefreshTokens.SingleOrDefaultAsync(u => u.UserId == id);
                _context.Remove(user);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(PasswordDTO p)
        {
            try
            {

                // Xác thực người dùng

                var result = await _context.Users.SingleOrDefaultAsync(x => x.UserId == p.UserId);
                if (p.OldPassword != HashHelper.Decrypt(result.Password, _configuration))
                {
                    return BadRequest("Mật khẩu cũ không đúng");
                }

                //}
                else
                {
                    /// result = await _context.Users.SingleOrDefaultAsync(x => x.UserId == p.UserId);
                    // }

                    if (result != null && result.StatusId == 1 && RegexConstant.validateGuidRegex.IsMatch(result.Password))
                    {
                        result.Password = HashHelper.Encrypt(p.Password, _configuration);
                        await _context.SaveChangesAsync();
                        return Ok("Thành công");
                    }
                    else
                    {
                        return BadRequest("Không có dữ liệu");
                    }
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, "Đã xảy ra lỗi khi thực hiện thay đổi mật khẩu");
            }
        }

        [HttpPost("reset-password-by-email")]
        public async Task<IActionResult> ResetPasswordByEmail(string username)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username && u.StatusId == 1);
                var email = user.Email;
                if (user != null /*&& emailToken != null*/)
                {
                    var password = TokenHelper.GenerateNumericToken(8);
                    var token = TokenHelper.GenerateRandomToken(64);

                    MailMessage mm = new MailMessage("wmsystemsp24@gmail.com", email);
                    mm.Subject = "Reset your password";
                    mm.Body = "Reset Password" + "<br>" +
                        "Tên đăng nhập " + username + "<br>" +
                        "Mật khẩu của bạn đã được thay đổi: " + password + "<br>";
                    mm.IsBodyHtml = true;
                    SmtpClient smtp = new SmtpClient();
                    smtp.Host = "smtp.gmail.com";
                    smtp.EnableSsl = true;
                    NetworkCredential NetworkCred = new NetworkCredential();
                    NetworkCred.UserName = "wmsystemsp24@gmail.com";
                    NetworkCred.Password = "jxpd wccm kits gona";
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = NetworkCred;
                    smtp.EnableSsl = true;
                    smtp.Port = 587;
                    smtp.Send(mm);
                    var emailtoken = new EmailToken
                    {
                        Token = token,
                        IssuedAt = DateTime.UtcNow,
                        ExpiredAt = DateTime.UtcNow.AddDays(1),
                        IsRevoked = false,
                        IsUsed = true,
                        UserId = user.UserId
                    };
                    user.Password = HashHelper.Encrypt(password, _configuration);
                    _context.Update(user);
                    _context.Add(emailtoken);
                    await _context.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    return BadRequest("Invalid Email");
                }
            }
            catch
            {
                return StatusCode(500);
            }
        }

    }
}
