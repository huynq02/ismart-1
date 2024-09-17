using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using iSmart.Entity.DTOs.WarehouseDTO;
using iSmart.Service;

namespace iSmart.API.Controllers
{
    [Route("api/warehouse")]
    [ApiController]
    //[Authorize]

    public class WarehouseController : ControllerBase
    {
        private readonly IWarehouseService _storageService;

        public WarehouseController(IWarehouseService storageService)
        {
            _storageService = storageService;
        }

        // GET: StorageController
        [HttpGet("get-all-warehouses")]
        public IActionResult GetAllStorage()
        {
            var result = _storageService.GetAllStorage();
            return Ok(result);
        }

        [HttpGet("get-warehouse")]
        // GET: StorageController/Details/5
        public IActionResult GetStorageByKeyword(int page, string? keyword = "")
        {
            var result = _storageService.GetStoragesByKeyword(page, keyword);
            return Ok(result);
        }

        [HttpPost("add-warehouse")]
        public async Task<IActionResult> AddStorage(CreateWarehouseRequest storage)
        {
            var result = _storageService.AddStorage(storage);
            return Ok(result);
        }

        [HttpPut("update-warehouse")]
        public async Task<IActionResult> UpdateStorage(UpdateWarehouseRequest storage)
        {
            var result = _storageService.UpdateStorage(storage);
            return Ok(result);
        }
    }
}
