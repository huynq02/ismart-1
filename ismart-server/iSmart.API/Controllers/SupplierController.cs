using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using iSmart.Entity.DTOs.SupplierDTO;
using iSmart.Service;
using Microsoft.AspNetCore.Authorization;

namespace WM.API.Controllers
{
    [Route("api/supplier")]
    [ApiController]
    //[Authorize]

    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;
        public SupplierController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        [HttpGet("get-all-supplier")]
        public async Task<IActionResult> GetAllSupplier()
        {
            var result = await _supplierService.GetAllSupplier();        
            return Ok(result);
        }

        [HttpGet("get-all-supplier-as-internal-warehouses")]
        public async Task<IActionResult> GetAllSupplierAsInternalWarehouses()
        {
            var result = await _supplierService.GetInternalWarehouses();
            return Ok(result);
        }

        [HttpGet("get-all-supplier-active")]
        public async Task<IActionResult> GetAllSupplierActive()
        {
            var result = await _supplierService.GetAllActiveSupplier();
            return Ok(result);
        }

        [HttpGet("get-supplier")]
        public IActionResult GetSupplierByKeyword(int page, int? statusId, string? keyword = "")
        {
            var result = _supplierService.GetSupplierByKeyword(page, statusId, keyword);
            return Ok(result);
        }

        [HttpPost("add-supplier")]
        public async Task<IActionResult> AddSupplier(CreateSupplierRequest supplier, bool isWarehouse)
        {
            var result = _supplierService.AddSupplier(supplier, isWarehouse);
            return Ok(result);
        }

        [HttpPut("update-supplier")]
        public async Task<IActionResult> UpdateSupplier(UpdateSupplierRequest supplier)
        {
            var result = _supplierService.UpdateSupplier(supplier);
            return Ok(result);
        }

        [HttpPut("update-supplier-status")]
        public async Task<IActionResult> UpdateStatus(int id)
        {
            var result =  _supplierService.UpdateDeleteStatusSupplier(id);
            return Ok(result);
        }
    }
}
