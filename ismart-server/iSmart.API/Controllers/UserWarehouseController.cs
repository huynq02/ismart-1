using iSmart.Entity.Models;
using iSmart.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iSmart.API.Controllers
{
    [Route("api/users/{userId}/warehouses")]
    [ApiController]
    public class UserWarehouseController : ControllerBase
    {
        private readonly IUserWarehouseService _userWarehouseService;

        public UserWarehouseController(IUserWarehouseService userWarehouseService)
        {
            _userWarehouseService = userWarehouseService;
        }

        [HttpGet("GetWarehouseManagerId")]
        public async Task<IActionResult> GetWarehouseManagerId(int userId)
        {
            var managerId = await _userWarehouseService.GetWarehouseManagerIdByStaffId(userId);

            if (managerId.HasValue)
            {
                return Ok(managerId);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<Warehouse>>> GetUserWarehouses(int userId)
        {
            var warehouses = await _userWarehouseService.GetUserWarehousesAsync(userId);
            return Ok(warehouses);
        }

        [HttpPost("{warehouseId}")]
        public async Task<IActionResult> AddUserToWarehouse(int userId, int warehouseId)
        {
            await _userWarehouseService.AddUserToWarehouseAsync(userId, warehouseId);
            return NoContent();
        }

        [HttpDelete("{warehouseId}")]
        public async Task<IActionResult> RemoveUserFromWarehouse(int userId, int warehouseId)
        {
            try
            {
                var success = await _userWarehouseService.RemoveUserFromWarehouseAsync(userId, warehouseId);
                if (success)
                {
                    return NoContent();
                }
                return NotFound(new { message = "The user is not assigned to the specified warehouse." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }
    }
}
